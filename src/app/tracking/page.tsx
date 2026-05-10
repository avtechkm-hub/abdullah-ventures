"use client";

import { useEffect, useMemo, useState } from 'react';
import SEO from '../../components/SEO';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import { serviceStatusOptions } from '../../data/serviceCatalog';
import { usePortalAccess } from '../../hooks/usePortalAccess';
import { canManageCompany } from '../../lib/accessControl';
import { getServiceRequestsForAccess, updateServiceRequestProgress } from '../../lib/partnerPortalApi';
import ServiceRequestsTable from '../../components/dashboard/ServiceRequestsTable';

const Tracking = () => {
  const { access, loading: loadingAccess } = usePortalAccess();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [savingRequestId, setSavingRequestId] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('REQUESTED');
  const [selectedProgressPercent, setSelectedProgressPercent] = useState(0);
  const [selectedAdminNote, setSelectedAdminNote] = useState('');
  const [error, setError] = useState('');
  const [serviceRequests, setServiceRequests] = useState([]);
  const canEditStatus = canManageCompany(access);

  const loadRequests = async () => {
    if (!access) {
      setServiceRequests([]);
      setIsLoadingRequests(false);
      return;
    }

    setError('');
    setIsLoadingRequests(true);

    try {
      const requests = await getServiceRequestsForAccess(access);
      setServiceRequests(requests);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load your service requests.');
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (loadingAccess || !access) {
      return;
    }

    loadRequests();
  }, [access, loadingAccess]);

  const filteredRequests = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    const activeRequests = serviceRequests.filter((request) => request.status !== 'COMPLETED');

    if (!normalized) {
      return activeRequests;
    }

    return activeRequests.filter(
      (request) =>
        request.id.toLowerCase().includes(normalized) ||
        request.serviceName.toLowerCase().includes(normalized) ||
        request.status.toLowerCase().includes(normalized) ||
        request.requesterName.toLowerCase().includes(normalized) ||
        request.requesterEmail.toLowerCase().includes(normalized)
    );
  }, [searchTerm, serviceRequests]);

  const openRequestEditor = (request) => {
    if (!canEditStatus || !request) {
      return;
    }

    setSelectedRequest(request);
    setSelectedStatus(request.status || 'REQUESTED');
    setSelectedProgressPercent(Number(request.progressPercent ?? 0));
    setSelectedAdminNote(request.adminNote || '');
  };

  const closeRequestEditor = () => {
    setSelectedRequest(null);
    setSelectedStatus('REQUESTED');
    setSelectedProgressPercent(0);
    setSelectedAdminNote('');
  };

  const handleUpdateSelectedRequest = async () => {
    if (!canEditStatus || !selectedRequest) {
      return;
    }

    const sanitizedProgress = Math.max(0, Math.min(100, Number(selectedProgressPercent ?? 0)));
    const nextProgress = selectedStatus === 'COMPLETED' ? 100 : sanitizedProgress;

    setSavingRequestId(selectedRequest.id);
    setError('');

    try {
      await updateServiceRequestProgress(
        selectedRequest.id,
        {
          status: selectedStatus,
          progressPercent: nextProgress,
          adminNote: selectedAdminNote,
        },
        access
      );

      setServiceRequests((current) =>
        current.map((item) =>
          item.id === selectedRequest.id
            ? {
                ...item,
                status: selectedStatus,
                progressPercent: nextProgress,
                adminNote: selectedAdminNote,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );

      closeRequestEditor();
    } catch (updateError) {
      setError(updateError.message || 'Unable to update request status.');
    } finally {
      setSavingRequestId('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 lg:flex font-sans">
      <SEO title="Tracking | Abdullah Ventures" />
      <DashboardSidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-12 text-slate-800">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8 sm:mb-12 border-b-2 border-blue-600 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic">Tracking Center</h1>
          <div className="bg-slate-800 text-white px-4 py-1 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] w-fit">
            Service Progress
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
            {error}
          </div>
        )}

        {isLoadingRequests ? (
          <div className="bg-white rounded-[28px] shadow-lg border border-slate-200 p-6 sm:p-8">
            <p className="text-sm text-slate-500">Loading request progress...</p>
          </div>
        ) : (
          <ServiceRequestsTable
            requests={filteredRequests}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            editable={canEditStatus}
            onRequestClick={openRequestEditor}
          />
        )}

        {canEditStatus && selectedRequest && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/60">
            <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white shadow-2xl p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-600 mb-2">Edit Request</p>
                  <h2 className="text-xl font-black italic uppercase tracking-tight text-slate-900">
                    {selectedRequest.serviceName}
                  </h2>
                  <p className="text-xs text-slate-500 mt-2">
                    {selectedRequest.requesterName} • {selectedRequest.requesterEmail}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeRequestEditor}
                  className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900"
                >
                  Close
                </button>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(event) => setSelectedStatus(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-600"
                >
                  {serviceStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 leading-6">
                  {selectedRequest.details || 'No additional request details provided.'}
                </div>

                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Progress %
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={selectedProgressPercent}
                  onChange={(event) => setSelectedProgressPercent(Number(event.target.value))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-600"
                />
                {selectedStatus === 'COMPLETED' && (
                  <p className="text-[11px] font-bold text-slate-500">Completed status will be saved as 100% progress.</p>
                )}

                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Admin Note
                </label>
                <textarea
                  value={selectedAdminNote}
                  onChange={(event) => setSelectedAdminNote(event.target.value)}
                  rows={4}
                  placeholder="Add internal update note visible to user"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-600"
                />

                <button
                  type="button"
                  onClick={handleUpdateSelectedRequest}
                  disabled={savingRequestId === selectedRequest.id}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 disabled:opacity-60"
                >
                  {savingRequestId === selectedRequest.id ? 'Saving...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Valid statuses: {serviceStatusOptions.join(', ').replaceAll('_', ' ')}
        </p>
      </div>
    </div>
  );
};

export default Tracking;
