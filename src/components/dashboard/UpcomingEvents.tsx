import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Event } from '@/types';
import { format, isBefore, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface UpcomingEventsProps {
  events: Event[];
}

const eventTypeIcon = (type: Event['type']) => {
  switch (type) {
    case 'meeting':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
    case 'payment':
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
    case 'delivery':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200';
    case 'ceremony':
      return 'bg-wedding-100 text-wedding-700 dark:bg-wedding-900 dark:text-wedding-200';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200';
  }
};

const eventTypeLabel = (type: Event['type']) => {
  switch (type) {
    case 'meeting':
      return 'Reunião';
    case 'payment':
      return 'Pagamento';
    case 'delivery':
      return 'Entrega';
    case 'ceremony':
      return 'Cerimônia';
    default:
      return 'Outro';
  }
};

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

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  const { toast } = useToast();

  const isEventSoon = useCallback((eventDate: Date): boolean => {
    const today = new Date();
    const threeDaysFromNow = addDays(today, 3);
    return isBefore(eventDate, threeDaysFromNow) && !isBefore(eventDate, today);
  }, []);

  const showEventNotification = useCallback(
    (event: Event) => {
      toast({
        title: `${eventTypeEmoji(event.type)} ${event.title}`,
        description: `${format(new Date(event.start), "dd/MM/yyyy 'às' HH:mm")}${event.location ? ` em ${event.location}` : ''}`,
        variant: isEventSoon(new Date(event.start)) ? 'destructive' : 'default',
      });
    },
    [toast, isEventSoon]
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Card className='h-full'>
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Próximos Eventos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-auto">
        {events.length === 0 ? (
          <div className="my-10 text-muted-foreground text-center flex flex-col items-center justify-center">
            <Calendar className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">Nenhum evento próximo</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Adicione eventos no calendário para visualizá-los aqui
            </p>
          </div>
        ) : (
          <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
            {events.map((event) => {
              const eventDate = new Date(event.start);
              const isSoon = isEventSoon(eventDate);

              return (
                <motion.div
                  key={event.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-all hover:shadow-md',
                    isSoon
                      ? 'animate-pulse border-amber-500 bg-amber-50/50 dark:bg-amber-900/20'
                      : 'border-accent bg-accent/30 hover:bg-accent/50'
                  )}
                  onClick={() => showEventNotification(event)}
                  variants={item}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center justify-center bg-background rounded-md w-12 h-12 border shadow-sm">
                    <span className="text-xs font-medium text-primary/70">
                      {format(eventDate, 'MMM', { locale: ptBR }).toUpperCase()}
                    </span>
                    <span className="text-lg font-bold">{format(eventDate, 'dd')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm truncate flex items-center gap-1">
                        <span className="hidden xs:inline-block">{eventTypeEmoji(event.type)}</span>
                        {event.title}
                      </h4>
                      <Badge className={eventTypeIcon(event.type)} variant="outline">
                        {eventTypeLabel(event.type)}
                      </Badge>
                      {isSoon && (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {format(new Date(event.start), 'HH:mm')} -{' '}
                        {format(new Date(event.end), 'HH:mm')}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
