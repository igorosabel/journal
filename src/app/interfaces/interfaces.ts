import ApiStatus from '@enum/api-status.enum';
import { EntryInterface } from '@interfaces/entry.interfaces';
import { TagInterface } from '@interfaces/tag.interfaces';
import { UserInterface } from '@interfaces/user.interfaces';

export interface LoginData {
  name: string;
  pass: string;
}

export interface LoginResult {
  status: ApiStatus;
  user: UserInterface;
}

export interface RegisterData {
  name: string;
  pass: string;
  conf: string;
}

export interface RegisterResult {
  status: ApiStatus;
  user: UserInterface;
}

export interface HomeResult {
  status: ApiStatus;
  tag: TagInterface | null;
  tags: TagInterface[];
  entries: EntryInterface[];
}
