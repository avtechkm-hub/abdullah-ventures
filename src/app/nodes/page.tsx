"use client";

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import SEO from '../../components/SEO';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import { tradeNodes } from '../../data/tradeData';

const Nodes = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNodes = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    if (!normalized) {
      return tradeNodes;
    }

    return tradeNodes.filter(
      (node) =>
        node.name.toLowerCase().includes(normalized) ||
        node.type.toLowerCase().includes(normalized) ||
        node.status.toLowerCase().includes(normalized)
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-slate-100 lg:flex font-sans">
      <SEO title="Nodes | Abdullah Ventures" />
      <DashboardSidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-12 text-slate-800">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8 border-b-2 border-blue-600 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic">Global Nodes</h1>
          <div className="relative w-full sm:w-auto">
            <Search size={14} className="text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search node, type, status"
              className="w-full sm:w-auto pl-9 pr-3 py-2 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredNodes.map((node) => (
            <div key={node.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-black uppercase italic text-slate-900">{node.name}</h2>
                <span
                  className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${
                    node.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}
                >
                  {node.status}
                </span>
              </div>

              <p className="text-sm text-slate-500 mb-4">{node.type}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                {node.partners} partner companies
              </p>
            </div>
          ))}

          {filteredNodes.length === 0 && (
            <div className="md:col-span-2 xl:col-span-3 bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              No nodes found for this search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nodes;
