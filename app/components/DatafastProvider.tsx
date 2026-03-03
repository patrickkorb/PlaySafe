'use client';

import { useEffect } from 'react';
import { getAnalytics } from '@/lib/datafast';

export default function DatafastProvider() {
  useEffect(() => {
    getAnalytics();
  }, []);

  return null;
}
