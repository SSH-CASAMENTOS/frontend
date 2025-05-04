import React from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Calendar, CreditCard, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface DashboardStatsProps {
  upcomingWeddings: number;
  pendingPayments: number;
  pendingPaymentsAmount: number;
  upcomingEvents: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  upcomingWeddings,
  pendingPayments,
  pendingPaymentsAmount,
  upcomingEvents,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard
        title="Casamentos Ativos"
        value={upcomingWeddings}
        icon={Users}
        trend={{ value: 10, isPositive: true }}
        className="bg-gradient-to-br from-wedding-100/50 to-wedding-200/30"
      />
      <StatsCard
        title="Pagamentos Pendentes"
        value={pendingPayments}
        description={`Total: ${formatCurrency(pendingPaymentsAmount)}`}
        icon={CreditCard}
        className="bg-gradient-to-br from-amber-100/50 to-amber-200/30 dark:from-amber-900/20 dark:to-amber-800/10"
      />
      <StatsCard
        title="Eventos Próximos"
        value={upcomingEvents}
        description="Nos próximos 30 dias"
        icon={Calendar}
        className="bg-gradient-to-br from-primary/10 to-primary/5"
      />
    </div>
  );
};
