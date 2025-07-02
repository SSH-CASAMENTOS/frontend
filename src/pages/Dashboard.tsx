import React, { useEffect } from 'react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { WeddingSection } from '@/components/dashboard/WeddingSection';
import { EventsSection } from '@/components/dashboard/EventsSection';
import { useDashboard } from '@/hooks/useDashboard';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { BudgetDistribution } from '@/components/dashboard/BudgetDistribution';

const Dashboard = () => {
  const {
    stats,
    upcomingEvents,
    activeWedding,
    availableWeddings,
    budgetDistributionData,
    handleSelectWedding,
  } = useDashboard();

  useEffect(() => {
    if (activeWedding) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#EC4899', '#10B981'],
      });
    }
  }, [activeWedding]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex items-center gap-2 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-4 rounded-lg mb-6"
        variants={itemVariants}
      >
        <Home className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DashboardStats
          upcomingWeddings={stats.upcomingWeddings || 0}
          pendingPayments={stats.pendingPayments || 0}
          pendingPaymentsAmount={stats.totalBudget - stats.totalPaid || 0}
          upcomingEvents={stats.upcomingEvents || 0}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <WeddingSection weddings={availableWeddings} onSelectWedding={handleSelectWedding} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <EventsSection events={upcomingEvents} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <BudgetDistribution data={budgetDistributionData} />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
