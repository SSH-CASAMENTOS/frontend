import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Wedding, Event, Payment } from '@/types';
import { getEventsByWeddingId } from '@/services/events/getEventsByWeddingId';
import { getPayments } from '@/services/payments/getPayments';
import { addDays } from 'date-fns';
import { useEventEmitter } from '@/patterns/observer/EventEmitter';

interface DashboardStats {
  upcomingWeddings?: number;
  totalBudget?: number;
  totalPaid?: number;
  pendingPayments?: number;
  upcomingEvents?: number;
}

export const useDashboard = () => {
  const { availableWeddings, activeWedding, setActiveWedding } = useAppContext();
  const [stats, setStats] = useState<DashboardStats>({});
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const eventEmitter = useEventEmitter();
  const today = new Date();

  const budgetDistributionData = [
    { name: 'Buffet', value: 35, color: '#8B5CF6' },
    { name: 'Decoração', value: 20, color: '#EC4899' },
    { name: 'Local', value: 25, color: '#10B981' },
    { name: 'Fotografia', value: 10, color: '#F59E0B' },
    { name: 'Música', value: 5, color: '#3B82F6' },
    { name: 'Bolo', value: 3, color: '#EF4444' },
    { name: 'Outros', value: 2, color: '#6B7280' },
  ];

  const loadEvents = useCallback(async () => {
    if (activeWedding) {
      const events = await getEventsByWeddingId(activeWedding.id);
      const eventsFiltered = events.filter(
        (event) => event.start > today && event.start < addDays(today, 30)
      );
      setUpcomingEvents(eventsFiltered);

      const payments = await getPayments();
      const availableWeddingIds = availableWeddings.map((w) => w.id);

      const upcomingWeddings = availableWeddings.filter((w) => w.status === 'upcoming').length;
      const totalBudget = availableWeddings.reduce((sum, wedding) => sum + wedding.budget, 0);
      const totalPaid = availableWeddings.reduce((sum, wedding) => sum + wedding.totalPaid, 0);
      const pendingPayments = payments.filter(
        (p) => p.status === 'pending' && availableWeddingIds.includes(p.weddingId)
      ).length;
      const upcomingEvents = events.filter(
        (e) => e.start > today && e.start < addDays(today, 30)
      ).length;

      setStats({
        upcomingWeddings,
        totalBudget,
        totalPaid,
        pendingPayments,
        upcomingEvents,
      });
    } else {
      setStats({});
      setUpcomingEvents([]);
    }
  }, [activeWedding]);

  useEffect(() => {
    loadEvents();
  }, [activeWedding]);

  useEffect(() => {
    const handleEventCreated = () => {
      loadEvents();
    };

    const handleEventUpdated = () => {
      loadEvents();
    };

    const handleEventDeleted = () => {
      loadEvents();
    };

    eventEmitter.on('event:created', handleEventCreated);
    eventEmitter.on('event:updated', handleEventUpdated);
    eventEmitter.on('event:deleted', handleEventDeleted);

    return () => {
      eventEmitter.off('event:created', handleEventCreated);
      eventEmitter.off('event:updated', handleEventUpdated);
      eventEmitter.off('event:deleted', handleEventDeleted);
    };
  }, [eventEmitter, loadEvents]);

  const handleSelectWedding = (wedding: Wedding) => {
    setActiveWedding(wedding);
    eventEmitter.emit('wedding:selected', wedding.id);
  };

  return {
    stats,
    upcomingEvents,
    budgetDistributionData,
    availableWeddings,
    activeWedding,
    handleSelectWedding,
  };
};
