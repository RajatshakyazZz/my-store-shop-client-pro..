import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export interface CouponRule {
  id?: string;
  code: string;
  discount_type: 'percent' | 'percentage' | 'fixed' | 'fixed_cart';
  amount: number;
  is_active: boolean;
  min_order_amount?: number;
  max_discount?: number;
  expiry_date?: string;
  usage_limit?: number;
  usage_count?: number;
  description?: string;
}

// Built-in standard promotional codes as instant fallbacks
export const BUILTIN_COUPONS: Record<string, CouponRule> = {
  OFF20: {
    code: 'OFF20',
    discount_type: 'percent',
    amount: 20,
    is_active: true,
    expiry_date: '2026-12-31',
    description: 'Special 20% discount on entire cart',
  },
  WELCOME20: {
    code: 'WELCOME20',
    discount_type: 'percent',
    amount: 20,
    is_active: true,
    expiry_date: '2026-12-31',
    description: '20% off welcome offer',
  },
  VAULT20: {
    code: 'VAULT20',
    discount_type: 'percent',
    amount: 20,
    is_active: true,
    expiry_date: '2026-12-31',
    description: '20% off ZTORE launch discount',
  },
  FLAT50: {
    code: 'FLAT50',
    discount_type: 'fixed_cart',
    amount: 50,
    min_order_amount: 199,
    is_active: true,
    expiry_date: '2026-12-31',
    description: 'Flat ₹50 off on orders above ₹199',
  },
};

/**
 * Validates a coupon code server-side and computes the exact discount amount.
 */
export async function calculateCouponDiscount(
  rawCode: string,
  subtotal: number
): Promise<{
  valid: boolean;
  code: string;
  discountType?: string;
  discountPercent?: number;
  discountAmount?: number;
  newTotal?: number;
  error?: string;
  description?: string;
}> {
  const code = String(rawCode || '').trim().toUpperCase();
  if (!code) {
    return { valid: false, code: '', error: 'Please enter a coupon code.' };
  }

  if (subtotal <= 0) {
    return { valid: false, code, error: 'Cart must have a valid subtotal to apply a coupon.' };
  }

  let matchedCoupon: CouponRule | null = null;

  // 1. Try finding in Firestore 'coupons' collection
  if (db) {
    try {
      // Check direct doc by id/code
      const directDocRef = doc(db, 'coupons', code);
      const directDocSnap = await getDoc(directDocRef);
      if (directDocSnap.exists()) {
        matchedCoupon = { id: directDocSnap.id, ...(directDocSnap.data() as any) };
      } else {
        // Query collection for matching code field
        const collRef = collection(db, 'coupons');
        const snap = await getDocs(collRef);
        for (const d of snap.docs) {
          const data = d.data();
          if (String(data.code || d.id).trim().toUpperCase() === code) {
            matchedCoupon = { id: d.id, ...(data as any) };
            break;
          }
        }
      }
    } catch (err) {
      console.warn('Firestore coupon fetch fallback:', err);
    }
  }

  // 2. Fallback to built-in coupons
  if (!matchedCoupon && BUILTIN_COUPONS[code]) {
    matchedCoupon = BUILTIN_COUPONS[code];
  }

  if (!matchedCoupon) {
    return {
      valid: false,
      code,
      error: `Coupon "${code}" is invalid or does not exist.`,
    };
  }

  // 3. Status Check
  if (matchedCoupon.is_active === false) {
    return {
      valid: false,
      code,
      error: `Coupon "${code}" is currently disabled.`,
    };
  }

  // 4. Expiry Date Check
  if (matchedCoupon.expiry_date) {
    const expiry = new Date(matchedCoupon.expiry_date);
    expiry.setHours(23, 59, 59, 999);
    if (new Date() > expiry) {
      return {
        valid: false,
        code,
        error: `Coupon "${code}" has expired on ${matchedCoupon.expiry_date}.`,
      };
    }
  }

  // 5. Min order amount check
  if (matchedCoupon.min_order_amount && subtotal < matchedCoupon.min_order_amount) {
    return {
      valid: false,
      code,
      error: `Coupon "${code}" requires a minimum cart value of ₹${matchedCoupon.min_order_amount}.`,
    };
  }

  // 6. Usage limit check
  if (
    typeof matchedCoupon.usage_limit === 'number' &&
    typeof matchedCoupon.usage_count === 'number' &&
    matchedCoupon.usage_count >= matchedCoupon.usage_limit
  ) {
    return {
      valid: false,
      code,
      error: `Coupon "${code}" has reached its maximum usage limit.`,
    };
  }

  // 7. Calculate exact discount
  const isPercent =
    matchedCoupon.discount_type === 'percent' ||
    matchedCoupon.discount_type === 'percentage';

  let discountAmount = 0;
  if (isPercent) {
    const rawDiscount = (subtotal * Number(matchedCoupon.amount)) / 100;
    discountAmount = Math.round(rawDiscount);
    if (matchedCoupon.max_discount && discountAmount > matchedCoupon.max_discount) {
      discountAmount = matchedCoupon.max_discount;
    }
  } else {
    discountAmount = Math.min(subtotal, Math.round(Number(matchedCoupon.amount)));
  }

  // Discount cannot exceed subtotal - 1 (minimum payable ₹1)
  discountAmount = Math.max(0, Math.min(discountAmount, subtotal - 1));
  const newTotal = Math.max(1, subtotal - discountAmount);

  return {
    valid: true,
    code,
    discountType: isPercent ? 'percent' : 'fixed',
    discountPercent: isPercent ? Number(matchedCoupon.amount) : undefined,
    discountAmount,
    newTotal,
    description: matchedCoupon.description || `${isPercent ? `${matchedCoupon.amount}%` : `₹${matchedCoupon.amount}`} discount applied!`,
  };
}
