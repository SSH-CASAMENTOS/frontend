import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Event, EventType } from '@/types';
import { cn } from '@/lib/utils';

interface EventTypeBadgeProps {
  type: EventType;
  className?: string;
}

export const EventTypeBadge: React.FC<EventTypeBadgeProps> = ({ type, className }) => {
  switch (type) {
    case 'meeting':
      return (
        <Badge
          className={cn('bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200', className)}
        >
          Reunião
        </Badge>
      );
    case 'payment':
      return (
        <Badge
          className={cn(
            'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
            className
          )}
        >
          Pagamento
        </Badge>
      );
    case 'delivery':
      return (
        <Badge
          className={cn(
            'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
            className
          )}
        >
          Entrega
        </Badge>
      );
    case 'ceremony':
      return (
        <Badge
          className={cn(
            'bg-wedding-100 text-wedding-700 dark:bg-wedding-900 dark:text-wedding-200',
            className
          )}
        >
          Cerimônia
        </Badge>
      );
    default:
      return (
        <Badge
          className={cn('bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200', className)}
        >
          Outro
        </Badge>
      );
  }
};
