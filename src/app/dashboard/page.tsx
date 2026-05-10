"use client";

import { useEffect, useMemo, useState } from 'react';
import SEO from '../../components/SEO';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import ServiceRequestsTable from '../../components/dashboard/ServiceRequestsTable';
import StatsCards from '../../components/dashboard/StatsCards';
import { usePortalAccess } from '../../hooks/usePortalAccess';
import { getPortalSnapshot, getServiceRequestsForAccess, subscribeToCompanyData } from '../../lib/partnerPortalApi';

const emptySnapshot = {
  company: {
    id: '',
    companyName: 'Abdullah Ventures',
    contactName: 'Partner Operations Team',
    email: process.env.NEXT_PUBLIC_PARTNER_DEMO_EMAIL || 'mdsalmantd5@gmail.com',
    region: 'Bangladesh',
    status: 'Active',
  },
  shipments: [],
  stats: [
    { label: 'Shipments', value: '0' },
    { label: 'Delivered', value: '0' },
    { label: 'Trade Routes', value: '0' },
  ],
};

const PortalDashboard = () => {
  const { access, loading: loadingAccess } = usePortalAccess();
  const [searchTerm, setSearchTerm] = useState('');
  const [portalSnapshot, setPortalSnapshot] = useState(emptySnapshot);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [isLoadingSnapshot, setIsLoadingSnapshot] = useState(true);

  const filteredRequests = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    const requests = serviceRequests || [];

    if (!normalized) {
      return requests;
    }

    return requests.filter(
      (request) =>
        request.id.toLowerCase().includes(normalized) ||
        request.serviceName.toLowerCase().includes(normalized) ||
        request.status.toLowerCase().includes(normalized) ||
        request.requesterName.toLowerCase().includes(normalized) ||
        request.requesterEmail.toLowerCase().includes(normalized)
    );
  }, [serviceRequests, searchTerm]);

  useEffect(() => {
    if (loadingAccess) {
      return undefined;
    }

    let isMounted = true;
    let unsubscribe = () => {};

    const loadSnapshot = async () => {
      setIsLoadingSnapshot(true);

      const [snapshot, requests] = await Promise.all([getPortalSnapshot(access), getServiceRequestsForAccess(access)]);

      if (!isMounted) {
        return;
      }

      setPortalSnapshot(snapshot);
      setServiceRequests(requests);
      setIsLoadingSnapshot(false);

      unsubscribe = subscribeToCompanyData(snapshot.company.id, async () => {
        const [nextSnapshot, nextRequests] = await Promise.all([
          getPortalSnapshot(access),
          getServiceRequestsForAccess(access),
        ]);

        if (isMounted) {
          setPortalSnapshot(nextSnapshot);
          setServiceRequests(nextRequests);
        }
      });
    };

    loadSnapshot();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [access, loadingAccess]);

  return (
    <div className="min-h-screen bg-slate-100 lg:flex font-sans">
      <SEO title="Partner Portal | Abdullah Ventures" />
      <DashboardSidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-12 text-slate-800">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8 sm:mb-12 border-b-2 border-blue-600 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic">Partner Dashboard</h1>
          <div className="bg-blue-600 text-white px-4 py-1 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] w-fit">
            Real-Time Sync
          </div>
        </div>

        <StatsCards stats={portalSnapshot.stats} />

        <ServiceRequestsTable
          requests={filteredRequests}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {(loadingAccess || isLoadingSnapshot) && (
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Loading company data...
          </p>
        )}
      </div>
    </div>
  );
};

const Dashboard = (props) => <PortalDashboard {...props} />;

export default Dashboard;
