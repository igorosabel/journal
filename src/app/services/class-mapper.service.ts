import { Injectable } from '@angular/core';
import { EntryInterface } from '@interfaces/entry.interfaces';
import { TagInterface } from '@interfaces/tag.interfaces';
import { UserInterface } from '@interfaces/user.interfaces';
import Entry from '@model/entry.model';
import Tag from '@model/tag.model';
import User from '@model/user.model';

@Injectable({
  providedIn: 'root',
})
export default class ClassMapperService {
  getUser(u: UserInterface): User {
    return new User().fromInterface(u);
  }

  getUsers(us: UserInterface[]): User[] {
    return us.map((u: UserInterface): User => {
      return this.getUser(u);
    });
  }

  getEntry(e: EntryInterface): Entry {
    return new Entry().fromInterface(e);
  }

  getEntries(es: EntryInterface[]): Entry[] {
    return es.map((e: EntryInterface): Entry => {
      return this.getEntry(e);
    });
  }

  getTag(t: TagInterface): Tag {
    return new Tag().fromInterface(t);
  }

  getTags(ts: TagInterface[]): Tag[] {
    return ts.map((t: TagInterface): Tag => {
      return this.getTag(t);
    });
  }
}
