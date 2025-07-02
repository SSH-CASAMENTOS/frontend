import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Wedding, Event, Payment } from '@/types';
import { getDashboardStats, getPaymentsByWeddingId } from '@/data/mockData';
import { getEventsByWeddingId } from '@/services/events/getEventsByWeddingId';
import { addDays } from 'date-fns';
import { useEventEmitter } from '@/patterns/observer/EventEmitter';

export const useDashboard = () => {
  const { availableWeddings, activeWedding, setActiveWedding } = useAppContext();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([]);
  const eventEmitter = useEventEmitter();

  const today = new Date();
  const stats = getDashboardStats();

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
      const eventsFiltered = events.filter((event) => event.start > today && event.start < addDays(today, 30));
      setUpcomingEvents(eventsFiltered);

      const payments = getPaymentsByWeddingId(activeWedding.id).filter(
        (payment) => payment.status === 'pending'
      );
      setPendingPayments(payments);
    } else {
      setUpcomingEvents([]);
      setPendingPayments([]);
    }
  }, [activeWedding, today]);

  useEffect(() => {
    loadEvents();
  }, []);

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
    pendingPayments,
    budgetDistributionData,
    availableWeddings,
    activeWedding,
    handleSelectWedding,
  };
};
