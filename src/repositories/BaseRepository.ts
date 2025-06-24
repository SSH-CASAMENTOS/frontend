export interface Entity {
  id: string;
}

export abstract class BaseRepository<T extends Entity> {
  protected storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  public getAll(): T[] {
    try {
      const items = localStorage.getItem(this.storageKey);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`);
      return [];
    }
  }

  public getById(id: string): T | undefined {
    const items = this.getAll();
    return items.find((item) => item.id === id);
  }

  public create(item: T): T {
    const items = this.getAll();
    const newItems = [...items, item];
    localStorage.setItem(this.storageKey, JSON.stringify(newItems));
    return item;
  }

  public update(item: T): T | undefined {
    const items = this.getAll();
    const index = items.findIndex((i) => i.id === item.id);

    if (index === -1) return undefined;

    items[index] = item;
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    return item;
  }

  public delete(id: string): boolean {
    const items = this.getAll();
    const filteredItems = items.filter((item) => item.id !== id);

    if (filteredItems.length === items.length) return false;

    localStorage.setItem(this.storageKey, JSON.stringify(filteredItems));
    return true;
  }

  public clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}
