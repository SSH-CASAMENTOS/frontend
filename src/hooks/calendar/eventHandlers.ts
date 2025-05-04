import { Event } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { EventFormData } from './types';
import { eventToFormData, createDefaultFormData } from './calendarUtils';
import {
  AddEventCommand,
  DeleteEventCommand,
  EventCommandInvoker,
  UpdateEventCommand,
} from './commands/eventCommands';
import { EventFactory } from './factories/eventFactory';
import { EventValidator } from './validators/eventValidator';
import { createInputChangeHandler, createSelectChangeHandler } from './strategies/formStrategies';
import { useEventEmitter } from '@/patterns/observer/EventEmitter';

export const useEventHandlers = (
  events: Event[],
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>,
  selectedDate: Date | undefined,
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>,
  selectedEvent: Event | null,
  setSelectedEvent: React.Dispatch<React.SetStateAction<Event | null>>,
  isViewDialogOpen: boolean,
  setIsViewDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  isAddDialogOpen: boolean,
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  isEditDialogOpen: boolean,
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  formData: EventFormData,
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>,
  activeWeddingId: string | undefined
) => {
  const { toast } = useToast();
  const eventEmitter = useEventEmitter();

  const commandInvoker = new EventCommandInvoker();
  const eventFactory = new EventFactory();
  const eventValidator = new EventValidator();

  commandInvoker.registerCommand('add', new AddEventCommand(events, setEvents));
  commandInvoker.registerCommand('update', new UpdateEventCommand(events, setEvents));
  commandInvoker.registerCommand('delete', new DeleteEventCommand(events, setEvents));

  const resetFormData = () => {
    setFormData(createDefaultFormData(selectedDate));
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsViewDialogOpen(true);
  };

  const handleAddClick = () => {
    resetFormData();
    setIsAddDialogOpen(true);
  };

  const handleEditClick = () => {
    if (selectedEvent) {
      const formattedData = eventToFormData(selectedEvent);
      setFormData(formattedData);
      setIsViewDialogOpen(false);
      setIsEditDialogOpen(true);
    }
  };

  const handleInputChange = createInputChangeHandler(setFormData);
  const handleSelectChange = createSelectChangeHandler(setFormData);

  const handleSaveEvent = (isEdit = false) => {
    if (!activeWeddingId) return;

    try {
      const validation = eventValidator.validate(formData);

      if (!validation.valid) {
        toast({
          title: 'Erro',
          description: validation.message,
          variant: 'destructive',
        });
        return;
      }

      const startDate = new Date(`${formData.date}T${formData.startTime}`);
      const endDate = new Date(`${formData.date}T${formData.endTime}`);

      const attendeesArray = formData.attendees
        ? formData.attendees
            .split(',')
            .map((a) => a.trim())
            .filter(Boolean)
        : undefined;

      const eventData: Omit<Event, 'id'> = {
        weddingId: activeWeddingId,
        title: formData.title,
        start: startDate,
        end: endDate,
        type: formData.type as Event['type'],
        location: formData.location || undefined,
        description: formData.description || undefined,
        attendees: attendeesArray,
      };

      if (isEdit && selectedEvent) {
        const updatedEvent = eventFactory.createEvent(eventData, selectedEvent.id);
        commandInvoker.executeCommand('update', updatedEvent);

        setIsEditDialogOpen(false);
        setSelectedEvent(null);

        toast({
          title: 'Evento atualizado',
          description: 'O evento foi atualizado com sucesso.',
        });

        eventEmitter.emit('event:updated', updatedEvent);
      } else {
        const newEvent = eventFactory.createEvent(eventData);
        commandInvoker.executeCommand('add', newEvent);

        setIsAddDialogOpen(false);

        toast({
          title: 'Evento adicionado',
          description: 'O novo evento foi adicionado com sucesso.',
        });

        eventEmitter.emit('event:created', newEvent);
      }

      if (formData.date) {
        setSelectedDate(new Date(formData.date));
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o evento.',
        variant: 'destructive',
      });
      console.error('Error saving event:', error);
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      commandInvoker.executeCommand('delete', selectedEvent);

      setIsViewDialogOpen(false);
      setSelectedEvent(null);

      toast({
        title: 'Evento removido',
        description: 'O evento foi removido com sucesso.',
      });

      eventEmitter.emit('event:deleted', selectedEvent);
    }
  };

  return {
    handleEventClick,
    handleAddClick,
    handleEditClick,
    handleInputChange,
    handleSelectChange,
    handleSaveEvent,
    handleDeleteEvent,
  };
};
