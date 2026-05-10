"use client";
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { usePortalAccess } from '../../hooks/usePortalAccess';

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const loadingScreen = (
  <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
    <div className="text-center">
      <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-black">
        Loading Secure Session
      </p>
    </div>
  </div>
);

const ClerkProtectedRoute = ({
  children,
  requireAdmin = false,
  skipProfileCheck = false,
}: {
  children: ReactNode;
  requireAdmin?: boolean;
  skipProfileCheck?: boolean;
}) => {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { access, profileCompleted, loading } = usePortalAccess();

  useEffect(() => {
    if (!isLoaded || loading) {
      return;
    }

    if (!userId) {
      router.replace('/login');
      return;
    }

    if (!skipProfileCheck && !profileCompleted) {
      router.replace('/onboarding');
      return;
    }

    if (requireAdmin && !['admin', 'super_admin'].includes(access?.role || '')) {
      router.replace('/dashboard');
    }
  }, [isLoaded, loading, userId, profileCompleted, access, requireAdmin, skipProfileCheck, router]);

  if (
    !isLoaded ||
    loading ||
    !userId ||
    (!skipProfileCheck && !profileCompleted) ||
    (requireAdmin && !['admin', 'super_admin'].includes(access?.role || ''))
  ) {
    return loadingScreen;
  }

  return children;
};

const ProtectedRoute = ({ children, requireAdmin = false, skipProfileCheck = false }) => {
  if (!hasClerk) {
    return children;
  }

  return <ClerkProtectedRoute requireAdmin={requireAdmin} skipProfileCheck={skipProfileCheck}>{children}</ClerkProtectedRoute>;
};

export default ProtectedRoute;

