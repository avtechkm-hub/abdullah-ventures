"use client";

import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import SEO from '../../components/SEO';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import { usePortalAccess } from '../../hooks/usePortalAccess';
import { canManageCompany } from '../../lib/accessControl';
import { getUserDirectoryForAccess } from '../../lib/partnerPortalApi';

const formatDate = (value) => {
  if (!value) {
    return '-';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const phoneToWhatsApp = (value = '') => value.replace(/[^\d]/g, '');

const Users = () => {
  const { access, loading: loadingAccess } = usePortalAccess();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  const canView = canManageCompany(access);

  useEffect(() => {
    if (loadingAccess || !access) {
      return;
    }

    const load = async () => {
      setIsLoading(true);
      setError('');

      try {
        if (!canView) {
          setUsers([]);
          return;
        }

        const directory = await getUserDirectoryForAccess(access);
        setUsers(directory);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load user directory.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [access, canView, loadingAccess]);

  const filteredUsers = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    if (!normalized) {
      return users;
    }

    return users.filter(
      (user) =>
        user.requesterName.toLowerCase().includes(normalized) ||
        user.requesterEmail.toLowerCase().includes(normalized) ||
        (user.companyName || '').toLowerCase().includes(normalized) ||
        (user.contactNumber || '').toLowerCase().includes(normalized)
    );
  }, [searchTerm, users]);

  return (
    <div className="min-h-screen bg-slate-100 lg:flex font-sans">
      <SEO title="Users | Abdullah Ventures" />
      <DashboardSidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-12 text-slate-800">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8 sm:mb-12 border-b-2 border-blue-600 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic">Users Directory</h1>
          <div className="bg-slate-800 text-white px-4 py-1 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] w-fit">
            Contact & Requests
          </div>
        </div>

        {!canView && !loadingAccess && (
          <div className="bg-white rounded-[28px] shadow-lg border border-slate-200 p-8">
            <h2 className="text-xl font-black italic uppercase tracking-tight text-slate-900 mb-4">Access Restricted</h2>
            <p className="text-slate-500 leading-7">Only founders/admins can view the users directory.</p>
          </div>
        )}

        {canView && (
          <>
            <div className="mb-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search name, email, company, phone"
                className="w-full max-w-xl rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                {error}
              </div>
            )}

            <div className="bg-white rounded-[28px] shadow-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 border-b uppercase tracking-widest">
                      <th className="p-6 italic">User</th>
                      <th className="p-6 italic">Email</th>
                      <th className="p-6 italic">Contact Number</th>
                      <th className="p-6 italic">Company</th>
                      <th className="p-6 italic">Address</th>
                      <th className="p-6 italic text-center">Total Requests</th>
                      <th className="p-6 italic">Latest Status</th>
                      <th className="p-6 italic">Last Active</th>
                      <th className="p-6 italic text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="text-xs font-bold">
                    {isLoading ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-500 text-sm">
                          Loading users...
                        </td>
                      </tr>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => {
                        const whatsAppNumber = phoneToWhatsApp(user.contactNumber || '');
                        return (
                          <tr key={user.id} className="border-b hover:bg-slate-50 transition-all align-top">
                            <td className="p-6 uppercase italic text-slate-700">{user.requesterName || '-'}</td>
                            <td className="p-6 text-slate-600">{user.requesterEmail || '-'}</td>
                            <td className="p-6 text-slate-600">{user.contactNumber || '-'}</td>
                            <td className="p-6 text-slate-600">{user.companyName || '-'}</td>
                            <td className="p-6 text-slate-600">
                              {[user.addressLine, user.city, user.country].filter(Boolean).join(', ') || '-'}
                            </td>
                            <td className="p-6 text-center text-slate-700">{user.totalRequests}</td>
                            <td className="p-6 text-slate-600">{(user.latestStatus || '-').replace('_', ' ')}</td>
                            <td className="p-6 text-slate-500">{formatDate(user.lastUpdatedAt)}</td>
                            <td className="p-6">
                              <div className="flex justify-end gap-2">
                                {user.contactNumber ? (
                                  <a
                                    href={`tel:${user.contactNumber}`}
                                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-600 hover:text-blue-600"
                                  >
                                    <Phone size={12} /> Call
                                  </a>
                                ) : (
                                  <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-300">
                                    No Number
                                  </span>
                                )}
                                {whatsAppNumber ? (
                                  <a
                                    href={`https://wa.me/${whatsAppNumber}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-600 hover:text-blue-600"
                                  >
                                    <MessageCircle size={12} /> Message
                                  </a>
                                ) : (
                                  <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-300">
                                    No Chat
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-500 text-sm">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Users;
