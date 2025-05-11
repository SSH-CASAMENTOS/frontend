import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface CalendarCardProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  isDayWithEvents: (date: Date) => boolean;
}

const CalendarCard: React.FC<CalendarCardProps> = ({
  selectedDate,
  setSelectedDate,
  isDayWithEvents,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-md overflow-hidden border-t-4 border-t-primary">
        <CardHeader className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent pb-2">
          <CardTitle className="flex items-center justify-center gap-2">
            <span className="text-primary">📅</span> Calendário de Eventos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex justify-center">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border p-3 pointer-events-auto"
            locale={ptBR}
            modifiers={{
              withEvents: (date) => isDayWithEvents(date),
            }}
            modifiersStyles={{
              withEvents: {
                fontWeight: 'bold',
                color: 'var(--primary)',
                background: 'var(--primary-foreground)',
                border: '2px solid var(--primary)',
                transform: 'scale(1.05)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                borderRadius: '100%',
              },
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CalendarCard;
