import { EntryInterface } from '@interfaces/entry.interfaces';
import { TagInterface } from '@interfaces/tag.interfaces';
import Entry from '@model/entry.model';
import { urldecode, urlencode } from '@osumi/tools';

export default class Tag {
  constructor(
    public id: number | null = null,
    public idParent: number | null = null,
    public name: string | null = null,
    public lastUsedAt: string | null = null,
    public entries: Entry[] = [],
  ) {}

  fromInterface(tag: TagInterface): Tag {
    this.id = tag.id;
    this.idParent = tag.idParent;
    this.name = urldecode(tag.name);
    this.lastUsedAt = tag.lastUsedAt;
    this.entries = tag.entries.map((e: EntryInterface): Entry => new Entry().fromInterface(e));

    return this;
  }

  toInterface(): TagInterface {
    return {
      id: this.id,
      idParent: this.idParent,
      name: urlencode(this.name),
      lastUsedAt: this.lastUsedAt,
      entries: this.entries.map((e: Entry): EntryInterface => e.toInterface()),
    };
  }
}
