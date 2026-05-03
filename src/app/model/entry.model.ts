import { EntryInterface } from '@interfaces/entry.interfaces';
import { TagInterface } from '@interfaces/tag.interfaces';
import Tag from '@model/tag.model';
import { urldecode, urlencode } from '@osumi/tools';

export default class Entry {
  constructor(
    public id: number | null = null,
    public title: string | null = null,
    public body: string | null = null,
    public createdAt: string | null = null,
    public updatedAt: string | null = null,
    public tags: Tag[] = [],
  ) {}

  fromInterface(entry: EntryInterface): Entry {
    this.id = entry.id;
    this.title = urldecode(entry.title);
    this.body = urldecode(entry.body);
    this.createdAt = entry.createdAt;
    this.updatedAt = entry.updatedAt;
    this.tags = entry.tags.map((t: TagInterface): Tag => new Tag().fromInterface(t));

    return this;
  }

  toInterface(): EntryInterface {
    return {
      id: this.id,
      title: urlencode(this.title),
      body: urlencode(this.body),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      tags: this.tags.map((t: Tag): TagInterface => t.toInterface()),
    };
  }
}
