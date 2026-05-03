import { EntryInterface } from '@interfaces/entry.interfaces';

export interface TagInterface {
  id: number | null;
  idParent: number | null;
  name: string | null;
  lastUsedAt: string | null;
  entries: EntryInterface[];
}
