import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EventTypeBadge } from './EventTypeBadge';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import EmptyState from '@/components/ui/EmptyState';
import { useIsMobile } from '@/hooks/use-mobile';

interface DayEventsCardProps {
  selectedDate: Date | undefined;
  events: Event[];
  onEventClick: (event: Event) => void;
  onAddClick: () => void;
}

const DayEventsCard: React.FC<DayEventsCardProps> = ({
  selectedDate,
  events,
  onEventClick,
  onAddClick,
}) => {
  const isMobile = useIsMobile();

  const formatEventTime = (date: Date) => {
    return format(date, 'HH:mm', { locale: ptBR });
  };

  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-full"
    >
      <Card className="shadow-md overflow-hidden border-t-4 border-t-primary h-full flex flex-col">
        <CardHeader className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent pb-2 flex-shrink-0">
          <CardTitle className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-primary">📋</span>
              <span className="text-sm sm:text-base">
                {selectedDate
                  ? `Eventos para ${format(selectedDate, "dd 'de' MMMM", {
                      locale: ptBR,
                    })}`
                  : 'Eventos do dia'}
              </span>
            </div>
            <Button
              size={isMobile ? 'sm' : 'default'}
              variant="outline"
              onClick={onAddClick}
              className={isMobile ? 'text-xs px-2 py-1 h-auto' : ''}
            >
              <Plus className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
              {isMobile ? 'Adicionar' : 'Novo Evento'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent
          className="flex-1 overflow-y-auto pt-2"
          style={{ maxHeight: isMobile ? '300px' : '400px' }}
        >
          {selectedDate ? (
            sortedEvents.length > 0 ? (
              <div className="space-y-3 mt-2 pb-1">
                {sortedEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    className="p-3 rounded-lg border bg-card shadow-sm hover:shadow-md cursor-pointer transition-all"
                    onClick={() => onEventClick(event)}
                    whileHover={{ scale: 1.02, translateX: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-start flex-wrap gap-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <EventTypeBadge type={event.type} className={isMobile ? 'text-xs' : ''} />
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                      <span className="font-medium whitespace-nowrap">
                        {formatEventTime(event.start)} - {formatEventTime(event.end)}
                      </span>
                      {event.location && (
                        <span className="opacity-70 text-xs sm:text-sm">| {event.location}</span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-xs mt-2 line-clamp-2 text-muted-foreground">
                        {event.description}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center py-6">
                <EmptyState
                  icon={<Calendar className={isMobile ? 'h-8 w-8' : 'h-12 w-12'} />}
                  title="Nenhum evento para esta data"
                  description="Clique em 'Adicionar' para criar um evento"
                  imageSrc="https://illustrations.popsy.co/fuchsia/taking-notes.svg"
                />
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center py-10">
              <p className="text-muted-foreground text-center">
                Selecione uma data no calendário
                <br />
                para ver os eventos
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DayEventsCard;
