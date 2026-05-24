import Tag from '@model/tag.model';

export default interface TagTreeNode {
  key: string;
  tag: Tag | null;
  name: string;
  children: TagTreeNode[];
  expanded: boolean;
  loading: boolean;
  loaded: boolean;
  selectable: boolean;
  hasChildren: boolean;
}
