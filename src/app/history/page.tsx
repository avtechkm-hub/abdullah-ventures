"use client";

import { useEffect, useMemo, useState } from 'react';
import SEO from '../../components/SEO';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import { usePortalAccess } from '../../hooks/usePortalAccess';
import { getServiceRequestsForAccess } from '../../lib/partnerPortalApi';
import ServiceRequestsTable from '../../components/dashboard/ServiceRequestsTable';

const History = () => {
  const { access, loading: loadingAccess } = usePortalAccess();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [error, setError] = useState('');
  const [serviceRequests, setServiceRequests] = useState([]);

  useEffect(() => {
    if (loadingAccess || !access) {
      return;
    }

    const loadRequests = async () => {
      setError('');
      setIsLoadingRequests(true);

      try {
        const requests = await getServiceRequestsForAccess(access);
        setServiceRequests(requests);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load request history.');
      } finally {
        setIsLoadingRequests(false);
      }
    };

    loadRequests();
  }, [access, loadingAccess]);

  const completedRequests = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    const finished = serviceRequests.filter((request) => request.status === 'COMPLETED');

    if (!normalized) {
      return finished;
    }

    return finished.filter(
      (request) =>
        request.id.toLowerCase().includes(normalized) ||
        request.serviceName.toLowerCase().includes(normalized) ||
        request.status.toLowerCase().includes(normalized) ||
        request.requesterName.toLowerCase().includes(normalized) ||
        request.requesterEmail.toLowerCase().includes(normalized)
    );
  }, [searchTerm, serviceRequests]);

  return (
    <div className="min-h-screen bg-slate-100 lg:flex font-sans">
      <SEO title="History | Abdullah Ventures" />
      <DashboardSidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-12 text-slate-800">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8 sm:mb-12 border-b-2 border-blue-600 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic">Completed History</h1>
          <div className="bg-slate-800 text-white px-4 py-1 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] w-fit">
            Closed Requests
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
            {error}
          </div>
        )}

        {isLoadingRequests ? (
          <div className="bg-white rounded-[28px] shadow-lg border border-slate-200 p-6 sm:p-8">
            <p className="text-sm text-slate-500">Loading completed request history...</p>
          </div>
        ) : (
          <ServiceRequestsTable
            requests={completedRequests}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            editable={false}
          />
        )}
      </div>
    </div>
  );
};

export default History;
