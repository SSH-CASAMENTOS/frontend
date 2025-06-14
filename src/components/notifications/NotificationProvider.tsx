import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Event } from '@/types';
import { format, isBefore, addDays, isToday } from 'date-fns';
import { useAppContext } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { getCategoryIcon } from '@/lib/categoryIcons';
import { ptBR } from 'date-fns/locale';
import { useEventEmitter } from '@/patterns/observer/EventEmitter';

interface NotificationContextType {
  pendingNotifications: number;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  pendingNotifications: 0,
  markAllAsRead: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

const eventTypeEmoji = (type: Event['type']) => {
  switch (type) {
    case 'meeting':
      return '👥';
    case 'payment':
      return '💰';
    case 'delivery':
      return '📦';
    case 'ceremony':
      return '💍';
    default:
      return '📅';
  }
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeWedding } = useAppContext();
  const eventEmitter = useEventEmitter();
  const { toast } = useToast();
  const [pendingNotifications, setPendingNotifications] = useState(0);
  const [notifiedEvents, setNotifiedEvents] = useState<Set<string>>(new Set());

  const checkEventsForNotifications = (events: Event[]) => {
    const today = new Date();
    const threeDaysFromNow = addDays(today, 3);

    let newNotifications = 0;

    events.forEach((event) => {
      const eventDate = new Date(event.start);
      const eventId = event.id;

      if (
        !notifiedEvents.has(eventId) &&
        !isBefore(eventDate, today) &&
        isBefore(eventDate, threeDaysFromNow)
      ) {
        if (isToday(eventDate)) {
          const IconComponent = getCategoryIcon(event.type);

          toast({
            title: `${eventTypeEmoji(event.type)} Evento hoje: ${event.title}`,
            description: (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-xs">
                  <span className="font-medium">Horário:</span>
                  <span>{format(eventDate, 'HH:mm', { locale: ptBR })}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-medium">Local:</span>
                    <span>{event.location}</span>
                  </div>
                )}
                <Badge variant="outline" className="w-fit mt-1 flex items-center gap-1">
                  <IconComponent className="h-3 w-3" />
                  <span>{event.type}</span>
                </Badge>
              </div>
            ),
            variant: 'default',
          });
        }

        newNotifications++;

        setNotifiedEvents((prev) => {
          const updated = new Set(prev);
          updated.add(eventId);
          return updated;
        });
      }
    });

    setPendingNotifications((prev) => prev + newNotifications);
  };

  useEffect(() => {
    const handleNewEvent = (event: Event) => {
      checkEventsForNotifications([event]);
    };

    eventEmitter.on('event:created', handleNewEvent);

    return () => {
      eventEmitter.off('event:created', handleNewEvent);
    };
  }, [eventEmitter, notifiedEvents]);

  useEffect(() => {
    if (activeWedding) {
      import('@/data/mockData').then(({ getEventsByWeddingId }) => {
        const events = getEventsByWeddingId(activeWedding.id);
        checkEventsForNotifications(events);
      });
    }
  }, [activeWedding]);

  const markAllAsRead = () => {
    setPendingNotifications(0);
  };

  return (
    <NotificationContext.Provider value={{ pendingNotifications, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
