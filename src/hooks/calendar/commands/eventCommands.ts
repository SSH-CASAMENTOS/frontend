import { Event } from '@/types';
import React from 'react';

export abstract class EventCommand {
  constructor(
    protected events: Event[],
    protected setEvents: React.Dispatch<React.SetStateAction<Event[]>>
  ) {}

  abstract execute(event: Event): void;
}

export class AddEventCommand extends EventCommand {
  execute(event: Event): void {
    this.setEvents((prev) => [...prev, event]);
  }
}

export class UpdateEventCommand extends EventCommand {
  execute(event: Event): void {
    this.setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
  }
}

export class DeleteEventCommand extends EventCommand {
  execute(event: Event): void {
    this.setEvents((prev) => prev.filter((e) => e.id !== event.id));
  }
}

export class EventCommandInvoker {
  private commands: Map<string, EventCommand> = new Map();

  registerCommand(commandName: string, command: EventCommand): void {
    this.commands.set(commandName, command);
  }

  executeCommand(commandName: string, event: Event): void {
    const command = this.commands.get(commandName);
    if (command) {
      command.execute(event);
    } else {
      throw new Error(`Command ${commandName} not found`);
    }
  }
}
