import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import CalendarCard from './CalendarCard';
import DayEventsCard from './DayEventsCard';
import { useCalendar } from '@/hooks/calendar';
import EventFormDialog from './EventFormDialog';
import EventViewDialog from './EventViewDialog';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/EmptyState';

const CalendarPage: React.FC = () => {
  const {
    events,
    selectedDate,
    setSelectedDate,
    isAddDialogOpen,
    setIsAddDialogOpen,
    selectedEvent,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    formData,
    setFormData,
    isDayWithEvents,
    handleEventClick,
    handleAddClick,
    handleEditClick,
    handleInputChange,
    handleSelectChange,
    handleSaveEvent,
    handleDeleteEvent,
  } = useCalendar();

  const eventsForSelectedDay = selectedDate
    ? events.filter(
        (event) =>
          event.start.getFullYear() === selectedDate.getFullYear() &&
          event.start.getMonth() === selectedDate.getMonth() &&
          event.start.getDate() === selectedDate.getDate()
      )
    : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-2 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-4 rounded-lg"
      >
        <Calendar className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Calendário</h1>
      </motion.div>

      <div className="flex justify-end">
        <Button onClick={handleAddClick} className="gap-1">
          Novo Evento
        </Button>
      </div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CalendarCard
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          isDayWithEvents={isDayWithEvents}
        />

        <DayEventsCard
          selectedDate={selectedDate}
          events={eventsForSelectedDay}
          onEventClick={handleEventClick}
          onAddClick={handleAddClick}
        />
      </motion.div>

      {events.length === 0 && (
        <motion.div variants={itemVariants}>
          <EmptyState
            icon={<Calendar className="h-16 w-16" />}
            title="Nenhum evento no calendário"
            description="Adicione eventos para começar a organizar sua agenda"
            imageSrc="https://illustrations.popsy.co/fuchsia/late-for-meeting.svg"
          />
        </motion.div>
      )}

      <EventFormDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleSaveEvent={handleSaveEvent}
      />

      <EventFormDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleSaveEvent={() => handleSaveEvent(true)}
        isEdit
      />

      <EventViewDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        event={selectedEvent}
        onEdit={handleEditClick}
        onDelete={handleDeleteEvent}
      />
    </motion.div>
  );
};

export default CalendarPage;
