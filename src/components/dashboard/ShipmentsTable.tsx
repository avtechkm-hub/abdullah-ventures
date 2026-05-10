import { Search } from 'lucide-react';

const ShipmentsTable = ({ shipments, searchTerm, onSearchChange, tableLabel = 'Digital Logistics Tracker' }) => (
  <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden">
    <div className="p-4 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest italic flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center justify-between border-b border-blue-900">
      <span className="text-blue-400 font-black">{tableLabel}</span>
      <label className="relative normal-case tracking-normal">
        <Search size={14} className="text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search ID, origin, status"
          className="pl-9 pr-3 py-2 text-[11px] rounded bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
        />
      </label>
    </div>
    <div className="overflow-x-auto">
    <table className="w-full min-w-[640px] text-left">
      <thead>
        <tr className="bg-slate-50 text-[10px] font-black text-slate-400 border-b uppercase tracking-widest">
          <th className="p-6 italic">Tracking ID</th>
          <th className="p-6 italic">Origin Port</th>
          <th className="p-6 italic">Destination</th>
          <th className="p-6 italic">Cargo</th>
          <th className="p-6 italic text-center">Status</th>
          <th className="p-6 italic text-right">ETA Delivery</th>
        </tr>
      </thead>
      <tbody className="text-xs font-bold">
        {shipments.length > 0 ? (
          shipments.map((ship) => (
            <tr key={ship.id} className="border-b hover:bg-slate-50 transition-all font-sans">
              <td className="p-6 text-blue-600 font-mono italic underline">{ship.trackingId || ship.id}</td>
              <td className="p-6 uppercase italic text-slate-500">{ship.origin}</td>
              <td className="p-6 uppercase italic text-slate-500">{ship.destination || '-'}</td>
              <td className="p-6 uppercase italic text-slate-500">{ship.cargoType || '-'}</td>
              <td className="p-6 text-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-[9px] font-black italic tracking-widest border border-blue-200">
                  {ship.status}
                </span>
              </td>
              <td className="p-6 italic text-slate-400 text-right">{ship.eta}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">
              No shipments match your search.
            </td>
          </tr>
        )}
      </tbody>
    </table>
    </div>
  </div>
);

export default ShipmentsTable;
