// @ts-nocheck
'use client';

import React from 'react';
import OperationalDashboardComponent from '@gasrapido/ui/src/OperationalDashboardComponent';
import { createClient } from '@/lib/supabase/client';
import { MetricsService } from '@gasrapido/shared';

export default function DashboardPage() {
  const supabase = createClient();
  const metricsService = new MetricsService(supabase);

  return (
    <div className="min-h-screen bg-gray-50">
      <OperationalDashboardComponent metricsService={metricsService} />
    </div>
  );
}