"use client";
import { useEffect, useRef, useState } from 'react';
import { Show, UserButton } from '@clerk/nextjs';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useSidebar } from '../../hooks/useSidebar';

const homeLinks = [
  { label: 'About', href: '#about' },
  { label: 'Company Setup', href: '#company-setup' },
  { label: 'Services', href: '#services' },
  { label: 'Why Choose Us', href: '#why-choose-us' },
  { label: 'Contact', href: '#contact' },
];

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const ClerkAuthControls = ({ mobile = false, onAction = () => {} }) => {
  if (!hasClerk) {
    return (
      <>
        <Link href="/login"
          onClick={onAction}
          className={mobile ? 'text-slate-200 hover:text-blue-400' : 'hover:text-blue-400 transition'}
        >
          Login
        </Link>
        <Link href="/signup"
          onClick={onAction}
          className={
            mobile
              ? 'bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition border border-blue-400 text-center'
              : 'bg-blue-600 px-3 sm:px-5 md:px-6 py-2 rounded-full hover:bg-blue-700 transition border border-blue-400 shadow-lg whitespace-nowrap'
          }
        >
          Partner Portal
        </Link>
      </>
    );
  }

  return (
    <>
      <Show when="signed-out">
        <Link href="/login"
          onClick={onAction}
          className={mobile ? 'text-slate-200 hover:text-blue-400' : 'hover:text-blue-400 transition'}
        >
          Login
        </Link>
        <Link href="/signup"
          onClick={onAction}
          className={
            mobile
              ? 'bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition border border-blue-400 text-center'
              : 'bg-blue-600 px-3 sm:px-5 md:px-6 py-2 rounded-full hover:bg-blue-700 transition border border-blue-400 shadow-lg whitespace-nowrap'
          }
        >
          Sign Up
        </Link>
      </Show>
      <Show when="signed-in">
        <div className={mobile ? 'flex items-center justify-between' : 'flex items-center gap-3'}>
          <Link href="/dashboard"
            onClick={onAction}
            className={
              mobile
                ? 'text-slate-200 hover:text-blue-400'
                : 'bg-blue-600 px-3 sm:px-5 md:px-6 py-2 rounded-full hover:bg-blue-700 transition border border-blue-400 shadow-lg whitespace-nowrap'
            }
          >
            Dashboard
          </Link>
          <UserButton />
        </div>
      </Show>
    </>
  );
};

const Navbar = ({ showSidebarToggle = false, isHomeRoute = false }) => {
  const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(false);
  const navRef = useRef(null);
  const { openSidebar } = useSidebar();

  useEffect(() => {
    if (!isHomeRoute) {
      setIsHomeMenuOpen(false);
    }
  }, [isHomeRoute]);

  useEffect(() => {
    if (!isHomeMenuOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsHomeMenuOpen(false);
      }
    };

    const handleScroll = () => setIsHomeMenuOpen(false);
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsHomeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isHomeMenuOpen]);

  const handleMenuClick = () => {
    if (isHomeRoute) {
      setIsHomeMenuOpen((prev) => !prev);
      return;
    }

    openSidebar();
  };

  return (
    <nav ref={navRef} className="flex justify-between items-center px-4 sm:px-6 lg:px-10 py-4 sm:py-5 bg-slate-900 text-white sticky top-0 z-50 shadow-2xl border-b border-blue-900 gap-4">
      <Link href="/"
        className="text-lg sm:text-2xl font-black tracking-tighter text-blue-500 italic uppercase leading-tight"
      >
        ABDULLAH VENTURES
      </Link>
      <div className="ml-auto flex items-center gap-2 sm:gap-4 md:gap-8">
      <div className="hidden md:flex font-semibold text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] items-center gap-2 sm:gap-4 md:gap-8">
        {isHomeRoute ? (
          <>
            {homeLinks.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-blue-400 transition whitespace-nowrap">
                {item.label}
              </Link>
            ))}
            <ClerkAuthControls />
          </>
        ) : (
          <>
            <Link href="/" className="hover:text-blue-400 transition">
              Home
            </Link>
            <ClerkAuthControls />
          </>
        )}
      </div>
      {(showSidebarToggle || isHomeRoute) && (
        <button
          type="button"
          onClick={handleMenuClick}
          className="lg:hidden inline-flex items-center gap-2 px-3 py-2 rounded-full bg-slate-800 text-white border border-blue-900"
          aria-label={isHomeRoute ? (isHomeMenuOpen ? 'Close mobile menu' : 'Open mobile menu') : 'Open portal sidebar'}
          aria-expanded={isHomeRoute ? isHomeMenuOpen : undefined}
        >
          <Menu size={16} />
        </button>
      )}
      </div>

      {isHomeRoute && isHomeMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          className="absolute top-full left-4 right-4 mt-3 bg-slate-900 border border-blue-900 rounded-xl p-4 md:hidden shadow-2xl"
        >
          <div className="flex flex-col gap-3 text-[11px] font-black uppercase tracking-[0.15em]">
            {homeLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsHomeMenuOpen(false)}
                className="text-slate-200 hover:text-blue-400"
              >
                {item.label}
              </Link>
            ))}
            <ClerkAuthControls mobile onAction={() => setIsHomeMenuOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
