import React from 'react';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { BudgetDistribution } from '@/components/dashboard/BudgetDistribution';
import { Event } from '@/types';
import { PaymentStatus } from '@/components/dashboard/PaymentStatus';
import { motion } from 'framer-motion';
import { useDashboard } from '@/hooks/useDashboard';

interface EventsSectionProps {
  events: Event[];
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  const { activeWedding } = useDashboard();
  
  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      initial="hidden"
      animate="show"
    >
      <PaymentStatus totalBudget={activeWedding.budget} totalPaid={activeWedding.totalPaid} />
      <UpcomingEvents events={events} />
    </motion.div>
  );
};
