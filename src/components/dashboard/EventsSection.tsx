import React from 'react';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { BudgetDistribution } from '@/components/dashboard/BudgetDistribution';
import { Event } from '@/types';
import { PaymentStatus } from '@/components/dashboard/PaymentStatus';
import { motion } from 'framer-motion';

interface EventsSectionProps {
  events: Event[];
  budgetData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events, budgetData }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={item}>
        <UpcomingEvents events={events} />
        <PaymentStatus totalBudget={100} totalPaid={65} />
      </motion.div>
      <motion.div variants={item}>
        <BudgetDistribution data={budgetData} />
      </motion.div>
    </motion.div>
  );
};
