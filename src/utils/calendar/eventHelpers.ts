import { Event, EventType } from '@/types';
import { EventFormData } from '@/hooks/calendar/types';
import { format, isSameDay } from 'date-fns';

export class EventHelpers {
  static eventToFormData(event: Event): EventFormData {
    const startDate = event.start instanceof Date ? event.start : new Date(event.start);
    const endDate = event.end instanceof Date ? event.end : new Date(event.end);

    return {
      title: event.title,
      date: format(startDate, 'yyyy-MM-dd'),
      startTime: format(startDate, 'HH:mm'),
      endTime: format(endDate, 'HH:mm'),
      type: event.type,
      location: event.location || '',
      description: event.description || '',
      attendees: event.attendees ? event.attendees.join(', ') : '',
    };
  }

  static createDefaultFormData(selectedDate: Date | undefined): EventFormData {
    const today = selectedDate || new Date();

    return {
      title: '',
      date: format(today, 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '10:00',
      type: 'meeting',
      location: '',
      description: '',
      attendees: '',
    };
  }

  static checkDayHasEvents(day: Date, events: Event[]): boolean {
    return events.some((event) => {
      const eventStart = event.start instanceof Date ? event.start : new Date(event.start);
      return isSameDay(eventStart, day);
    });
  }

  static getEventColor(type: EventType): string {
    switch (type) {
      case 'meeting':
        return 'blue';
      case 'payment':
        return 'green';
      case 'delivery':
        return 'amber';
      case 'ceremony':
        return 'purple';
      case 'other':
        return 'gray';
      default:
        return 'gray';
    }
  }
}

export class EventDateStrategy {
  static sortByDate(events: Event[], ascending: boolean = true): Event[] {
    return [...events].sort((a, b) => {
      const dateA = new Date(a.start).getTime();
      const dateB = new Date(b.start).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  static filterByDateRange(events: Event[], startDate: Date, endDate: Date): Event[] {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  static filterByDate(events: Event[], date: Date): Event[] {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, date);
    });
  }
}
