import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useNotifications } from './NotificationProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const NotificationIndicator: React.FC = () => {
  const { pendingNotifications, markAllAsRead } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {pendingNotifications > 0 && (
              <motion.div
                className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                {pendingNotifications}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Notificações</h3>
            {pendingNotifications > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </div>
        <div className="max-h-80 overflow-auto p-2">
          {pendingNotifications === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 text-muted-foreground/50" />
              <p>Nenhuma notificação pendente</p>
              <p className="text-xs mt-1">As notificações aparecerão aqui</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="p-3 text-sm">
                Você tem {pendingNotifications} evento(s) próximo(s). Confira seu calendário para
                mais detalhes.
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
