'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import { SidebarProvider } from '../../hooks/useSidebar';

export default function ClientLayout({ children }) {
  const pathname = usePathname() || '';
  const isHomeRoute = pathname === '/';
  const isAuthRoute = ['/login', '/signup', '/onboarding'].includes(pathname);
  const showFooter = isHomeRoute;
  const isPortalRoute =
    ['/dashboard', '/request', '/tracking', '/history', '/users', '/nodes'].includes(pathname);

  return (
    <SidebarProvider>
      {!isAuthRoute && (
        <Navbar isHomeRoute={isHomeRoute} showSidebarToggle={isPortalRoute} />
      )}
      {children}
      {showFooter && <Footer />}
      {!isAuthRoute && <WhatsAppButton />}
    </SidebarProvider>
  );
}
