import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Event } from '@/types';
import { getEventsByWeddingId } from '@/services/events/getEventsByWeddingId';
import { checkDayHasEvents, createDefaultFormData, EventDayObserver } from './calendarUtils';
import { useEventHandlers } from './eventHandlers';
import { EventFormData, UseCalendarReturn } from './types';

export const useCalendar = (): UseCalendarReturn => {
  const { activeWedding } = useAppContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<EventFormData>(createDefaultFormData(selectedDate));

  const [eventDayObserver] = useState<EventDayObserver>(() => new EventDayObserver(events));

  useEffect(() => {
    if (activeWedding) {
      const handleGetEventsByWeddingId = async () => {
        const weddingEvents = await getEventsByWeddingId(activeWedding.id);
        const formattedEvents = weddingEvents.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));

        setEvents(formattedEvents);

        eventDayObserver.updateEvents(formattedEvents);
      };
      handleGetEventsByWeddingId();
    } else {
      setEvents([]);
      eventDayObserver.updateEvents([]);
    }
  }, [activeWedding, eventDayObserver]);

  const isDayWithEvents = (day: Date) => {
    return eventDayObserver.checkDayHasEvents(day);
  };

  const eventHandlers = useEventHandlers(
    events,
    setEvents,
    selectedDate,
    setSelectedDate,
    selectedEvent,
    setSelectedEvent,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    formData,
    setFormData,
    activeWedding?.id
  );

  return {
    events,
    selectedDate,
    setSelectedDate,
    isAddDialogOpen,
    setIsAddDialogOpen,
    selectedEvent,
    setSelectedEvent,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    formData,
    setFormData,
    isDayWithEvents,
    ...eventHandlers,
  };
};
