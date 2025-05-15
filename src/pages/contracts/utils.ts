import { Contract } from '@/types';
import { differenceInDays } from 'date-fns';

export const getStatusBadgeClass = (status: Contract['status'], expiresAt?: Date) => {
  if (status === 'active') {
    if (expiresAt && differenceInDays(new Date(expiresAt), new Date()) < 30) {
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200';
    }
    return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
  }
  if (status === 'completed') {
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
  }
  if (status === 'expired') {
    return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
  }
  return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200';
};

export const getStatusLabel = (status: Contract['status'], expiresAt?: Date) => {
  if (status === 'active') {
    if (expiresAt && differenceInDays(new Date(expiresAt), new Date()) < 30) {
      return 'Expira em breve';
    }
    return 'Ativo';
  }
  if (status === 'completed') {
    return 'Concluído';
  }
  if (status === 'expired') {
    return 'Expirado';
  }
  if (status === 'pending') {
    return 'Pendente';
  }
  return status;
};
