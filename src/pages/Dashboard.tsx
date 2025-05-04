import React, { useEffect } from 'react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { WeddingSection } from '@/components/dashboard/WeddingSection';
import { EventsSection } from '@/components/dashboard/EventsSection';
import { useDashboard } from '@/hooks/useDashboard';
import { Calendar, Home, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCategoryIcon } from '@/lib/categoryIcons';
import confetti from 'canvas-confetti';

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
          upcomingWeddings={stats.upcomingWeddings}
          pendingPayments={stats.pendingPayments}
          pendingPaymentsAmount={stats.totalBudget - stats.totalPaid}
          upcomingEvents={stats.upcomingEvents}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <WeddingSection
          weddings={availableWeddings}
          activeWedding={activeWedding}
          onSelectWedding={handleSelectWedding}
        />
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={itemVariants}>
        <div className="lg:col-span-2">
          <EventsSection events={upcomingEvents} budgetData={budgetDistributionData} />
        </div>

        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col items-center justify-center h-full text-center space-y-3">
            <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/5 p-4 mb-2">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium">Próximos Eventos</h3>
            <p className="text-muted-foreground text-sm">
              Você tem {stats.upcomingEvents} eventos nos próximos 30 dias
            </p>
            {activeWedding ? (
              <motion.div
                className="flex flex-col items-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Para o casamento "{activeWedding.title}"
                </p>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">{activeWedding.clientNames}</span>
                  <Heart className="h-4 w-4 text-red-500" />
                </div>
              </motion.div>
            ) : (
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Selecione um casamento para ver eventos específicos
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
