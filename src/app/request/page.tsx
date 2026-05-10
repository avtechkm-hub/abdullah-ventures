"use client";

import { useState } from 'react';
import SEO from '../../components/SEO';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import { serviceCatalog } from '../../data/serviceCatalog';
import { usePortalAccess } from '../../hooks/usePortalAccess';
import { createServiceRequest } from '../../lib/partnerPortalApi';

const RequestService = () => {
  const { access, loading: loadingAccess } = usePortalAccess();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    requesterName: access?.companyName || 'Portal User',
    serviceName: serviceCatalog[0],
    details: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!access) {
      setError('Unable to load your access profile. Please sign in again.');
      return;
    }

    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await createServiceRequest(form, access);
      setForm((current) => ({ ...current, details: '' }));
      setSuccess('Your request has been submitted successfully. You can track status from the tracking page.');
    } catch (submitError) {
      setError(submitError.message || 'Unable to submit your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 lg:flex font-sans">
      <SEO title="Request Service | Abdullah Ventures" />
      <DashboardSidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-12 text-slate-800">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8 sm:mb-12 border-b-2 border-blue-600 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic">Service Request</h1>
          <div className="bg-slate-800 text-white px-4 py-1 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] w-fit">
            Request Portal
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            {success}
          </div>
        )}

        <section className="bg-white rounded-[28px] shadow-lg border border-slate-200 p-6 sm:p-8 max-w-3xl">
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-600 mb-2">New Request</p>
            <h2 className="text-2xl font-black italic uppercase tracking-tight text-slate-900">Request A Service</h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              name="requesterName"
              value={form.requesterName}
              onChange={(event) => setForm((current) => ({ ...current, requesterName: event.target.value }))}
              placeholder="Your name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-600"
              required
            />

            <select
              name="serviceName"
              value={form.serviceName}
              onChange={(event) => setForm((current) => ({ ...current, serviceName: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-600"
              required
            >
              {serviceCatalog.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>

            <textarea
              name="details"
              value={form.details}
              onChange={(event) => setForm((current) => ({ ...current, details: event.target.value }))}
              placeholder="Briefly describe your requirement, timeline, and location."
              rows={6}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-600"
            />

            <button
              type="submit"
              disabled={isSubmitting || loadingAccess}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Service Request'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default RequestService;
