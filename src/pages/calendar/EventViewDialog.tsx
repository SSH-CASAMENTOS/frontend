import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event } from '@/types';
import { EventTypeBadge } from './EventTypeBadge';
import { Edit, Trash, MapPin, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface EventViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onEdit: () => void;
  onDelete: () => void;
}

const EventViewDialog: React.FC<EventViewDialogProps> = ({
  isOpen,
  onOpenChange,
  event,
  onEdit,
  onDelete,
}) => {
  const isMobile = useIsMobile();

  if (!event) return null;

  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm', { locale: ptBR });
  };

  const getEventBackgroundStyle = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/20';
      case 'payment':
        return 'bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/20';
      case 'delivery':
        return 'bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-950/50 dark:to-amber-900/20';
      case 'ceremony':
        return 'bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/20';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-950/50 dark:to-gray-900/20';
    }
  };

  const getEventImageUrl = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'https://illustrations.popsy.co/fuchsia/customer-support.svg';
      case 'payment':
        return 'https://illustrations.popsy.co/fuchsia/spending-money.svg';
      case 'delivery':
        return 'https://illustrations.popsy.co/fuchsia/package-delivery.svg';
      case 'ceremony':
        return 'https://illustrations.popsy.co/fuchsia/work-party.svg';
      default:
        return 'https://illustrations.popsy.co/fuchsia/late-for-meeting.svg';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <div className={`${getEventBackgroundStyle(event.type)} p-6`}>
          <DialogHeader>
            <div className="flex justify-between items-start mb-2">
              <EventTypeBadge type={event.type} />
            </div>
            <DialogTitle className="text-2xl font-bold mt-2">{event.title}</DialogTitle>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>
                {formatDate(event.start)} • {formatTime(event.start)} até {formatTime(event.end)}
              </span>
            </div>
          </DialogHeader>
        </div>

        <div className={`p-6 grid grid-cols-1 ${!isMobile ? 'md:grid-cols-3' : ''} gap-4`}>
          <div className="md:col-span-2 space-y-4">
            {event.location && (
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <span>{event.location}</span>
              </div>
            )}

            {event.description && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-1">Descrição:</h4>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            )}

            {event.attendees && event.attendees.length > 0 && (
              <div className="mt-4">
                <div className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium mb-1">Participantes:</h4>
                    <p className="text-sm text-muted-foreground">{event.attendees.join(', ')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className={`${isMobile ? 'flex justify-center items-center mt-4' : 'hidden md:flex md:items-center md:justify-center'}`}
          >
            <motion.img
              src={getEventImageUrl(event.type)}
              alt={`Imagem de ${event.type}`}
              className="w-full max-h-[150px] object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t gap-2 flex-col sm:flex-row">
          <Button
            variant="outline"
            onClick={onDelete}
            className="gap-1 text-destructive w-full sm:w-auto"
          >
            <Trash className="h-4 w-4" /> Excluir
          </Button>
          <Button onClick={onEdit} className="gap-1 w-full sm:w-auto">
            <Edit className="h-4 w-4" /> Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventViewDialog;
