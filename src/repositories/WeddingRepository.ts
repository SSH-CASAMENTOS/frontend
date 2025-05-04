import { Wedding } from '@/types';
import { BaseRepository } from './BaseRepository';

export class WeddingRepository extends BaseRepository<Wedding> {
  constructor() {
    super('weddings');
  }

  public getUpcoming(): Wedding[] {
    const weddings = this.getAll();
    return weddings.filter(
      (wedding) => wedding.status === 'upcoming' && new Date(wedding.date) > new Date()
    );
  }

  public getCompleted(): Wedding[] {
    const weddings = this.getAll();
    return weddings.filter((wedding) => wedding.status === 'completed');
  }

  public getCanceled(): Wedding[] {
    const weddings = this.getAll();
    return weddings.filter((wedding) => wedding.status === 'canceled');
  }

  public getByDateAsc(): Wedding[] {
    const weddings = this.getAll();
    return [...weddings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  public updateStatus(id: string, status: Wedding['status']): Wedding | undefined {
    const wedding = this.getById(id);
    if (!wedding) return undefined;

    const updatedWedding = { ...wedding, status };
    return this.update(updatedWedding);
  }
}
