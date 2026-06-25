'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userSlice';
import { CategoryGrid } from '@/features/categories/CategoryGrid';
import { ROUTES } from '@/constants/routes';

export default function CategoriesPage() {
  const router = useRouter();
  const { user, isHydrated } = useUserStore();

  useEffect(() => {
    if (isHydrated && !user) {
      router.replace(ROUTES.REGISTER);
    }
  }, [isHydrated, user, router]);

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-green-500/20 border-t-green-500 animate-spin" />
          <div
            className="absolute inset-0 w-12 h-12 rounded-full border-2 border-green-400/10 border-b-green-400 animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          />
        </div>
      </div>
    );
  }

  return <CategoryGrid />;
}
