"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Briefcase, MapPin, Phone, Building } from 'lucide-react';
import SEO from '../../components/SEO';
import { savePortalUserProfile } from '../../lib/partnerPortalApi';

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    addressLine: '',
    city: '',
    country: 'Bangladesh',
    companyName: '',
    notes: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill email and name from Clerk if available
  useEffect(() => {
    if (isLoaded && user) {
      setProfileForm((current) => ({
        ...current,
        email: user.primaryEmailAddress?.emailAddress || current.email,
        fullName: user.fullName || current.fullName,
      }));
    }
  }, [isLoaded, user]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      await savePortalUserProfile(profileForm);
      // Once profile is saved, redirect to the main portal dashboard
      router.push('/dashboard');
    } catch (submitError) {
      setError(submitError.message || 'Unable to save profile details.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-slate-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEO title="Complete Profile | Abdullah Ventures" />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-[28px] border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-8 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-slate-900 mb-2">
              Complete Your Profile
            </h1>
            <p className="text-sm text-slate-500 leading-6 mb-8">
              Please provide your business and contact information to finalize your partner account setup before accessing the dashboard.
            </p>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-bold text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    aria-label="Full Name"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-600 focus:ring-blue-600"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Contact Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="tel"
                      aria-label="Contact Number"
                      value={profileForm.contactNumber}
                      onChange={(e) => setProfileForm({ ...profileForm, contactNumber: e.target.value })}
                      className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm font-bold text-slate-900 focus:border-blue-600 focus:ring-blue-600"
                      placeholder="+880 123 456 789"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    aria-label="Company Name"
                    value={profileForm.companyName}
                    onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm font-bold text-slate-900 focus:border-blue-600 focus:ring-blue-600"
                    placeholder="Acme Trading Co."
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Address Line
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    aria-label="Address Line"
                    value={profileForm.addressLine}
                    onChange={(e) => setProfileForm({ ...profileForm, addressLine: e.target.value })}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm font-bold text-slate-900 focus:border-blue-600 focus:ring-blue-600"
                    placeholder="123 Export Lane"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    aria-label="City"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-600 focus:ring-blue-600"
                    placeholder="Dhaka"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    aria-label="Country"
                    value={profileForm.country}
                    onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-600 focus:ring-blue-600"
                    placeholder="Bangladesh"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  aria-label="Email Address"
                  value={profileForm.email}
                  disabled
                  className="w-full rounded-xl border-slate-200 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-500 cursor-not-allowed"
                />
                <p className="mt-2 text-xs text-slate-400">Email is bound to your secure Identity.</p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  aria-label="Complete Setup and Continue"
                  disabled={isSaving}
                  className="w-full rounded-xl bg-blue-600 px-8 py-4 font-black italic uppercase tracking-widest text-white shadow-xl shadow-blue-600/20 hover:bg-slate-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving Profile...' : 'Complete Setup & Continue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
