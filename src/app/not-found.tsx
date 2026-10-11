'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { NotFound } from '../components/NotFound';
import { getViewUrl } from '../services/navigation';

export default function GlobalNotFound() {
  const router = useRouter();

  return (
    <NotFound
      onNavigate={(view, category) => {
        router.push(getViewUrl(view, category));
      }}
    />
  );
}
