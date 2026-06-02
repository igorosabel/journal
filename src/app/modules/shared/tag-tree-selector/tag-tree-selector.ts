import { Tree, TreeItem, TreeItemGroup } from '@angular/aria/tree';
import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  effect,
  inject,
  model,
  ModelSignal,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatChipRemove, MatChipRow, MatChipSet } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import ApiStatus from '@enum/api-status.enum';
import TagTreeNode from '@interfaces/tag-tree-node.interface';
import { TagsResult } from '@interfaces/tag.interfaces';
import Tag from '@model/tag.model';
import ApiTagService from '@services/api-tag.service';
import ClassMapperService from '@services/class-mapper.service';

@Component({
  selector: 'app-tag-tree-selector',
  imports: [
    NgTemplateOutlet,
    Tree,
    TreeItem,
    TreeItemGroup,
    MatCheckbox,
    MatChipSet,
    MatChipRow,
    MatChipRemove,
    MatIcon,
    MatIconButton,
    MatProgressSpinner,
  ],
  templateUrl: './tag-tree-selector.html',
  styleUrl: './tag-tree-selector.scss',
})
export default class TagTreeSelector {
  private readonly apiTagService: ApiTagService = inject(ApiTagService);
  private readonly classMapperService: ClassMapperService = inject(ClassMapperService);

  selectedTags: ModelSignal<Tag[]> = model<Tag[]>([]);
  selectedTagKeys: WritableSignal<string[]> = signal<string[]>([]);
  nodes: WritableSignal<TagTreeNode[]> = signal<TagTreeNode[]>([this.createRootNode()]);

  constructor() {
    effect((): void => {
      const selectedTags: Tag[] = this.selectedTags();
      this.selectedTagKeys.set(selectedTags.map((tag: Tag): string => this.getTagKey(tag.id)));
    });
  }

  onExpandedChange(node: TagTreeNode, expanded: boolean): void {
    node.expanded = expanded;
    this.refreshNodes();

    if (expanded === true && node.loaded === false && node.loading === false) {
      this.loadChildren(node);
    }
  }

  onTreeValuesChange(keys: string[]): void {
    this.selectedTagKeys.set(keys);

    const selectedById: Map<number, Tag> = new Map<number, Tag>(
      this.selectedTags()
        .filter((tag: Tag): boolean => tag.id !== null)
        .map((tag: Tag): [number, Tag] => [tag.id as number, tag]),
    );

    this.collectLoadedTags(this.nodes()).forEach((tag: Tag): void => {
      if (tag.id !== null) {
        selectedById.set(tag.id, tag);
      }
    });

    const selectedTags: Tag[] = keys
      .map((key: string): number | null => this.getIdFromKey(key))
      .filter((id: number | null): id is number => id !== null)
      .map((id: number): Tag | undefined => selectedById.get(id))
      .filter((tag: Tag | undefined): tag is Tag => tag !== undefined);

    this.selectedTags.set(selectedTags);
  }

  toggleTag(node: TagTreeNode, checked: boolean): void {
    if (node.tag === null || node.tag.id === null) {
      return;
    }

    const key: string = this.getTagKey(node.tag.id);
    const currentKeys: string[] = this.selectedTagKeys();
    const keys: string[] =
      checked === true
        ? Array.from(new Set<string>([...currentKeys, key]))
        : currentKeys.filter((currentKey: string): boolean => currentKey !== key);

    this.onTreeValuesChange(keys);
  }

  removeTag(tag: Tag): void {
    if (tag.id === null) {
      return;
    }

    this.onTreeValuesChange(
      this.selectedTagKeys().filter((key: string): boolean => key !== this.getTagKey(tag.id)),
    );
  }

  isSelected(node: TagTreeNode): boolean {
    return this.selectedTagKeys().includes(node.key);
  }

  getExpandIcon(node: TagTreeNode): string {
    if (node.loading === true) {
      return 'hourglass_empty';
    }

    return node.expanded === true ? 'expand_more' : 'chevron_right';
  }

  trackNode(index: number, node: TagTreeNode): string {
    return node.key;
  }

  private loadChildren(node: TagTreeNode): void {
    node.loading = true;
    this.refreshNodes();

    this.apiTagService.getTags(node.tag?.id ?? null).subscribe((response: TagsResult): void => {
      node.loading = false;

      if (response.status === ApiStatus.OK) {
        node.children = this.classMapperService
          .getTags(response.tags)
          .map((tag: Tag): TagTreeNode => this.createTagNode(tag));
        node.loaded = true;
        node.hasChildren = node.children.length > 0;
      }

      this.refreshNodes();
    });
  }

  private createRootNode(): TagTreeNode {
    return {
      key: 'root',
      tag: null,
      name: 'Inicio',
      children: [],
      expanded: false,
      loading: false,
      loaded: false,
      selectable: false,
      hasChildren: true,
    };
  }

  private createTagNode(tag: Tag): TagTreeNode {
    return {
      key: this.getTagKey(tag.id),
      tag,
      name: tag.name ?? '',
      children: [],
      expanded: false,
      loading: false,
      loaded: false,
      selectable: true,
      hasChildren: true,
    };
  }

  private getTagKey(id: number | null): string {
    return id === null ? 'root' : `tag:${id}`;
  }

  private getIdFromKey(key: string): number | null {
    if (key.startsWith('tag:') === false) {
      return null;
    }

    return Number(key.replace('tag:', ''));
  }

  private collectLoadedTags(nodes: TagTreeNode[]): Tag[] {
    return nodes.flatMap((node: TagTreeNode): Tag[] => [
      ...(node.tag !== null ? [node.tag] : []),
      ...this.collectLoadedTags(node.children),
    ]);
  }

  private refreshNodes(): void {
    this.nodes.set([...this.nodes()]);
  }
}
