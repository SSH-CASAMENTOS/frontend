import { Event } from '@/types';

export interface EventFormData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  location: string;
  description: string;
  attendees: string;
}

export interface UseCalendarState {
  events: Event[];
  selectedDate: Date | undefined;
  isAddDialogOpen: boolean;
  selectedEvent: Event | null;
  isViewDialogOpen: boolean;
  isEditDialogOpen: boolean;
  formData: EventFormData;
}

export interface UseCalendarActions {
  setSelectedDate: (date: Date | undefined) => void;
  setIsAddDialogOpen: (open: boolean) => void;
  setSelectedEvent: (event: Event | null) => void;
  setIsViewDialogOpen: (open: boolean) => void;
  setIsEditDialogOpen: (open: boolean) => void;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  isDayWithEvents: (day: Date) => boolean;
  handleEventClick: (event: Event) => void;
  handleAddClick: () => void;
  handleEditClick: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string) => void;
  handleSaveEvent: (isEdit?: boolean) => void;
  handleDeleteEvent: () => void;
}

export type UseCalendarReturn = UseCalendarState & UseCalendarActions;
