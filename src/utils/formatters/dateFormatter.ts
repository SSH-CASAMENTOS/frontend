import { format, formatRelative } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date: Date | string): string => {
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
};

export const formatDateTime = (date: Date | string): string => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
};

export const formatRelativeDate = (date: Date | string): string => {
  return formatRelative(new Date(date), new Date(), { locale: ptBR });
};
