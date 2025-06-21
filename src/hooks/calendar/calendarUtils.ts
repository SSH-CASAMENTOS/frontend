import { Event } from '@/types';
import { format, isSameDay } from 'date-fns';
import { EventFormData } from './types';

class DateAdapter {
  static formatToInputDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  static formatToInputTime(date: Date): string {
    return format(date, 'HH:mm');
  }

  static parseDateTime(date: string, time: string): Date {
    return new Date(`${date}T${time}`);
  }
}

export const eventToFormData = (event: Event): EventFormData => {
  const startDate = event.start instanceof Date ? event.start : new Date(event.start);
  const endDate = event.end instanceof Date ? event.end : new Date(event.end);

  return {
    title: event.title,
    date: DateAdapter.formatToInputDate(startDate),
    startTime: DateAdapter.formatToInputTime(startDate),
    endTime: DateAdapter.formatToInputTime(endDate),
    type: event.type,
    location: event.location || '',
    description: event.description || '',
    attendees: event.attendees ? event.attendees.join(', ') : '',
  };
};

export const createDefaultFormData = (selectedDate: Date | undefined): EventFormData => {
  const today = selectedDate || new Date();

  return {
    title: '',
    date: DateAdapter.formatToInputDate(today),
    startTime: '09:00',
    endTime: '10:00',
    type: 'meeting',
    location: '',
    description: '',
    attendees: '',
  };
};

export class EventDayObserver {
  private events: Event[];

  constructor(events: Event[]) {
    this.events = events;
  }

  updateEvents(events: Event[]): void {
    this.events = events;
  }

  checkDayHasEvents(day: Date): boolean {
    return this.events.some((event) => {
      const eventStart = event.start instanceof Date ? event.start : new Date(event.start);
      return isSameDay(eventStart, day);
    });
  }
}

export const checkDayHasEvents = (day: Date, events: Event[]): boolean => {
  const observer = new EventDayObserver(events);
  return observer.checkDayHasEvents(day);
};
