'use client';

import React, { useState, useEffect } from 'react';
import { Settings, User, Mail, Phone, ShieldCheck, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useResellerAuth } from '@/context/ResellerAuthContext';

export default function ResellerSettingsPage() {
  const { user, profile, updateProfileData } = useResellerAuth();

  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<'upi' | 'bank'>('upi');
  const [upiId, setUpiId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setPhone(profile.phone || '');
      setPayoutMethod(profile.payoutMethod || 'upi');
      if (profile.payoutDetails) {
        setUpiId(profile.payoutDetails.upiId || '');
        setAccountNumber(profile.payoutDetails.accountNumber || '');
        setIfscCode(profile.payoutDetails.ifscCode || '');
        setAccountHolderName(profile.payoutDetails.accountHolderName || '');
      }
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSaving(true);

    try {
      await updateProfileData({
        displayName: displayName.trim(),
        phone: phone.trim(),
        payoutMethod,
        payoutDetails: {
          upiId: upiId.trim(),
          accountNumber: accountNumber.trim(),
          ifscCode: ifscCode.trim(),
          accountHolderName: accountHolderName.trim(),
        },
      });
      setSuccessMsg('Settings saved successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err?.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-red-100 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-black text-[#162048]">Account & Payout Settings</h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Manage your reseller profile, contact information, and default payout destinations.
        </p>
      </div>

      {/* Permanent Reseller UID Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="text-[10px] font-black uppercase tracking-wider text-amber-700">Permanent Reseller UID</div>
          <div className="font-mono text-lg font-black text-amber-950 mt-0.5">
            🆔 {profile?.resellerUid || 'Generating...'}
          </div>
          <p className="text-[11px] text-amber-800 mt-0.5">
            Permanent unique identifier linked to your account. Use this exact UID to link or restore on other phones & devices.
          </p>
        </div>
        {profile?.resellerUid && (
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(profile.resellerUid);
              alert(`Copied Reseller UID: ${profile.resellerUid}`);
            }}
            className="px-4 py-2 bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold rounded-xl text-xs transition shrink-0 active:scale-95"
          >
            Copy UID
          </button>
        )}
      </div>

      {/* Cross-Device Sync Status Card */}
      <div className="p-5 rounded-3xl bg-white border border-red-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black text-[#162048]">Cross-Device Cloud Sync</h4>
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-extrabold uppercase">
                Active
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Your wallet balance, products, and UID are automatically mirrored across all your phones and computers.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            if (user?.uid) {
              await updateProfileData({});
              alert('Cloud sync refreshed successfully!');
            }
          }}
          className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-[#dc2626] text-xs font-bold shrink-0 transition"
        >
          Sync Now
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-white border border-red-100 shadow-xs space-y-4 text-xs font-medium">
          <h2 className="text-sm font-black text-[#162048] flex items-center gap-2 border-b border-purple-50 pb-3">
            <User className="w-4 h-4 text-[#dc2626]" />
            <span>Profile Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Display Name / Partner Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#162048] focus:outline-none focus:border-[#dc2626]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 text-xs font-medium cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">
                WhatsApp / Contact Number <span className="text-gray-400 font-normal">(for payout receipts)</span>
              </label>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full max-w-sm px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-[#162048] focus:outline-none focus:border-[#dc2626]"
              />
            </div>
          </div>
        </div>

        {/* Payout Details Card */}
        <div className="p-6 rounded-3xl bg-white border border-red-100 shadow-xs space-y-4 text-xs font-medium">
          <h2 className="text-sm font-black text-[#162048] flex items-center gap-2 border-b border-purple-50 pb-3">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Default Payout Destination</span>
          </h2>

          <div>
            <label className="block font-bold text-gray-700 mb-2">Primary Payout Method</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPayoutMethod('upi')}
                className={`py-2 px-4 rounded-xl border text-xs font-bold transition-all ${
                  payoutMethod === 'upi'
                    ? 'border-[#dc2626] bg-red-50 text-[#dc2626]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                UPI ID (Instant)
              </button>
              <button
                type="button"
                onClick={() => setPayoutMethod('bank')}
                className={`py-2 px-4 rounded-xl border text-xs font-bold transition-all ${
                  payoutMethod === 'bank'
                    ? 'border-[#dc2626] bg-red-50 text-[#dc2626]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Direct Bank Account
              </button>
            </div>
          </div>

          {payoutMethod === 'upi' ? (
            <div className="max-w-md">
              <label className="block font-bold text-gray-700 mb-1">UPI ID (VPA)</label>
              <input
                type="text"
                placeholder="e.g. mobile@paytm or username@okhdfcbank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-[#162048] focus:outline-none focus:border-[#dc2626]"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  placeholder="Official Name on Bank Account"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-[#162048] focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  placeholder="Bank Account Number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-[#162048] focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">IFSC Code</label>
                <input
                  type="text"
                  placeholder="e.g. HDFC0001234"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-[#162048] focus:outline-none focus:border-[#dc2626]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Reseller Terms Agreement Card */}
        <div className="p-6 rounded-3xl bg-white border border-red-100 shadow-xs space-y-2 text-xs">
          <h3 className="font-bold text-[#162048]">Reseller Policy & Payout Terms</h3>
          <p className="text-gray-500 text-[11px] leading-relaxed">
            MYZTORE operates on a transparent gross-margin payout policy. You set your custom resale price above the official base price and receive 100% of that margin upon verified customer payment. Payouts are made directly to your provided UPI or Bank account with minimum ₹200 threshold.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Settings...' : 'Save Settings'}</span>
        </button>
      </form>
    </div>
  );
}
