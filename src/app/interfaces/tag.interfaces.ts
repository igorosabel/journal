import { EntryInterface } from '@interfaces/entry.interfaces';
import { Modal } from '@osumi/angular-tools';

export interface TagInterface {
  id: number | null;
  idParent: number | null;
  name: string | null;
  lastUsedAt: string | null;
  entries: EntryInterface[];
}

export interface TagResult {
  status: string;
  tag: TagInterface;
}

export interface EditTagData extends Modal {
  tag: TagInterface;
}
