'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { About } from '../../components/About';

export const AboutClient: React.FC = () => {
  const router = useRouter();
  return (
    <About
      onNavigateToTienda={() => router.push('/tienda')}
      onNavigateHome={() => router.push('/')}
    />
  );
};
