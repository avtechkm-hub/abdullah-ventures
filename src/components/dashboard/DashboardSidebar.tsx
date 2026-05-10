"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Archive, ClipboardList, Globe, Package, Users, X } from 'lucide-react';
import { usePortalAccess } from '../../hooks/usePortalAccess';
import { canManageCompany } from '../../lib/accessControl';
import { useSidebar } from '../../hooks/useSidebar';

const baseMenuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Activity, end: true },
  { to: '/request', label: 'Request Service', icon: ClipboardList },
  { to: '/tracking', label: 'Track Requests', icon: Package },
  { to: '/history', label: 'History', icon: Archive },
  { to: '/nodes', label: 'Nodes', icon: Globe },
];
const DashboardSidebar = () => {
  const { access } = usePortalAccess();
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const pathname = usePathname();
  const menuItems = canManageCompany(access)
    ? [...baseMenuItems, { to: '/users', label: 'Users', icon: Users }]
    : baseMenuItems;

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-slate-900 p-6 text-white border-r border-blue-900 z-[60] transition-transform duration-300 lg:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="text-blue-500 font-mono text-[9px] border border-blue-800 p-2.5 rounded italic tracking-widest text-center uppercase bg-slate-800/50 underline">
            System Active v2.6
          </div>
          <button
            type="button"
            onClick={closeSidebar}
            className="p-2 rounded border border-slate-700 text-slate-300"
            aria-label="Close sidebar menu"
          >
            <X size={16} />
          </button>
        </div>

        <ul className="space-y-5 font-black uppercase tracking-[0.15em] text-[10px]">
          {menuItems.map(({ to, label, icon: Icon, end }) => {
            const isActive = pathname === to || (!end && pathname.startsWith(to));
            return (
            <li key={`mobile-${to}`}>
              <Link
                href={to}
                onClick={closeSidebar}
                className={`flex items-center gap-3 transition px-3 py-2 rounded-lg border ${
                    isActive
                      ? 'text-blue-500 border-blue-500 bg-slate-800'
                      : 'text-slate-300 border-slate-700 hover:text-white'
                  }`}
              >
                <Icon size={14} /> {label}
              </Link>
            </li>
          )})}
        </ul>
      </aside>

      <div className="w-64 bg-slate-900 p-8 text-white hidden lg:block border-r border-blue-900">
        <div className="text-blue-500 font-mono text-[9px] mb-12 border border-blue-800 p-3 rounded italic tracking-widest text-center uppercase bg-slate-800/50 underline">
          System Active v2.6
        </div>
        <ul className="space-y-8 font-black uppercase tracking-[0.2em] text-[10px]">
          {menuItems.map(({ to, label, icon: Icon, end }) => {
            const isActive = pathname === to || (!end && pathname.startsWith(to));
            return (
            <li key={to}>
              <Link
                href={to}
                className={`flex items-center gap-3 transition ${
                    isActive ? 'text-blue-500' : 'text-slate-500 hover:text-white'
                  }`}
              >
                <Icon size={14} /> {label}
              </Link>
            </li>
          )})}
        </ul>
      </div>
    </>
  );
};

export default DashboardSidebar;
