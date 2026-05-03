import { TagInterface } from '@interfaces/tag.interfaces';

export interface EntryInterface {
  id: number | null;
  title: string | null;
  body: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  tags: TagInterface[];
}
