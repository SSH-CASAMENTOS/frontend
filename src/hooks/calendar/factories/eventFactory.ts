import { Event, EventType } from '@/types';
import { EventFormData } from '../types';

export class EventBuilder {
  private event: Partial<Event>;

  constructor(weddingId: string) {
    this.event = {
      id: `event-${Date.now()}`,
      weddingId,
    };
  }

  withTitle(title: string): EventBuilder {
    this.event.title = title;
    return this;
  }

  withDateTimes(start: Date, end: Date): EventBuilder {
    this.event.start = start;
    this.event.end = end;
    return this;
  }

  withType(type: EventType): EventBuilder {
    this.event.type = type;
    return this;
  }

  withLocation(location?: string): EventBuilder {
    if (location && location.trim()) {
      this.event.location = location;
    }
    return this;
  }

  withDescription(description?: string): EventBuilder {
    if (description && description.trim()) {
      this.event.description = description;
    }
    return this;
  }

  withAttendees(attendees?: string[]): EventBuilder {
    if (attendees && attendees.length > 0) {
      this.event.attendees = attendees;
    }
    return this;
  }

  withId(id: string): EventBuilder {
    this.event.id = id;
    return this;
  }

  build(): Event {
    if (!this.event.title || !this.event.start || !this.event.end || !this.event.type) {
      throw new Error('Evento incompleto. Campos obrigatórios: title, start, end, type.');
    }

    return this.event as Event;
  }
}

export class EventFactory {
  createEventFromForm(formData: EventFormData, weddingId: string, existingId?: string): Event {
    const startDate = new Date(`${formData.date}T${formData.startTime}`);
    const endDate = new Date(`${formData.date}T${formData.endTime}`);

    const attendeesArray = formData.attendees
      ? formData.attendees
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean)
      : undefined;

    const builder = new EventBuilder(weddingId)
      .withTitle(formData.title)
      .withDateTimes(startDate, endDate)
      .withType(formData.type as EventType)
      .withLocation(formData.location)
      .withDescription(formData.description)
      .withAttendees(attendeesArray);

    if (existingId) {
      builder.withId(existingId);
    }

    return builder.build();
  }

  createEvent(eventData: Omit<Event, 'id'>, id?: string): Event {
    const builder = new EventBuilder(eventData.weddingId)
      .withTitle(eventData.title)
      .withDateTimes(new Date(eventData.start), new Date(eventData.end))
      .withType(eventData.type);

    if (eventData.location) {
      builder.withLocation(eventData.location);
    }

    if (eventData.description) {
      builder.withDescription(eventData.description);
    }

    if (eventData.attendees) {
      builder.withAttendees(eventData.attendees);
    }

    if (id) {
      builder.withId(id);
    }

    return builder.build();
  }
}
