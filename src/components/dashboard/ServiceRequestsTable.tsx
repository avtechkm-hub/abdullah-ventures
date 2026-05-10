"use client";
import { Search } from 'lucide-react';

type ServiceRequestsTableProps = {
  requests: any[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  editable?: boolean;
  onRequestClick?: (request: any) => void;
};

const statusStyles = {
  REQUESTED: 'bg-amber-100 text-amber-800 border-amber-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
  ON_HOLD: 'bg-rose-100 text-rose-800 border-rose-200',
  COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

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

const shortId = (value) => (value ? value.slice(0, 8).toUpperCase() : '-');

const ServiceRequestsTable = ({
  requests,
  searchTerm,
  onSearchChange,
  editable = false,
  onRequestClick,
}: ServiceRequestsTableProps) => (
  <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden">
    <div className="p-4 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest italic flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center justify-between border-b border-blue-900">
      <span className="text-blue-400 font-black">Live Service Tracker</span>
      <label className="relative normal-case tracking-normal">
        <Search size={14} className="text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search ID, user, service, status"
          className="pl-9 pr-3 py-2 text-[11px] rounded bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
        />
      </label>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left">
        <thead>
          <tr className="bg-slate-50 text-[10px] font-black text-slate-400 border-b uppercase tracking-widest">
            <th className="p-6 italic">Request ID</th>
            <th className="p-6 italic">Requested By</th>
            <th className="p-6 italic">Service</th>
            <th className="p-6 italic text-center">Status</th>
            <th className="p-6 italic text-center">Progress</th>
            <th className="p-6 italic">Admin Note</th>
            <th className="p-6 italic text-right">Last Update</th>
          </tr>
        </thead>

        <tbody className="text-xs font-bold">
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr
                key={request.id}
                className={`border-b transition-all font-sans align-top ${
                  editable ? 'hover:bg-blue-50 cursor-pointer' : 'hover:bg-slate-50'
                }`}
                onClick={() => editable && onRequestClick?.(request)}
              >
                <td className="p-6 text-blue-600 font-mono italic underline">SR-{shortId(request.id)}</td>
                <td className="p-6 text-slate-600">
                  <p className="uppercase italic text-slate-500">{request.requesterName || '-'}</p>
                  <p className="mt-1 text-[11px] text-slate-400 normal-case">{request.requesterEmail || '-'}</p>
                </td>
                <td className="p-6 uppercase italic text-slate-500">{request.serviceName || '-'}</td>
                <td className="p-6 text-center">
                  <span
                    className={`px-3 py-1 rounded text-[9px] font-black italic tracking-widest border ${statusStyles[request.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}
                  >
                    {(request.status || '').replace('_', ' ')}
                  </span>
                </td>
                <td className="p-6 text-center">
                  <div className="w-28 mx-auto">
                    <p className="text-[10px] text-slate-500 mb-1">{request.progressPercent}%</p>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: `${request.progressPercent}%` }} />
                    </div>
                  </div>
                </td>
                <td className="p-6 text-slate-500 max-w-[240px]">{request.adminNote || '-'}</td>
                <td className="p-6 italic text-slate-400 text-right">{formatDate(request.updatedAt || request.createdAt)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-8 text-center text-slate-500 text-sm">
                No service requests match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {editable && (
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
        Click a request row to edit status
      </div>
    )}
  </div>
);

export default ServiceRequestsTable;
