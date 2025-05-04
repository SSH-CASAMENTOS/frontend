export interface Command<T> {
  execute(data: T): void;
  undo?(): void;
}

export class CommandInvoker<T = unknown> {
  private commands: Map<string, Command<T>>;
  private history: { commandName: string; data: T }[] = [];

  constructor() {
    this.commands = new Map();
  }

  public registerCommand(commandName: string, command: Command<T>): void {
    this.commands.set(commandName, command);
  }

  public executeCommand(commandName: string, data: T): void {
    const command = this.commands.get(commandName);

    if (!command) {
      throw new Error(`Command ${commandName} not found`);
    }

    command.execute(data);
    this.history.push({ commandName, data });
  }

  public undo(): boolean {
    const lastCommand = this.history.pop();

    if (!lastCommand) {
      return false;
    }

    const command = this.commands.get(lastCommand.commandName);

    if (!command || !command.undo) {
      return false;
    }

    command.undo();
    return true;
  }

  public getHistory(): { commandName: string; data: T }[] {
    return [...this.history];
  }
}
