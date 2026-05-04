import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatActionList, MatListItem, MatListItemIcon, MatNavList } from '@angular/material/list';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { TagResult } from '@app/interfaces/tag.interfaces';
import ApiStatus from '@app/model/enum/api-status.enum';
import { HomeResult } from '@interfaces/interfaces';
import Entry from '@model/entry.model';
import Tag from '@model/tag.model';
import { Modal, OverlayService } from '@osumi/angular-tools';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import AddTag from '@shared/add-tag/add-tag';

@Component({
  selector: 'app-home',
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatNavList,
    MatListItem,
    MatListItemIcon,
    MatIcon,
    MatToolbar,
    MatToolbarRow,
    RouterLink,
    MatIconButton,
    MatTabsModule,
    MatActionList,
    MatFabButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export default class Home implements OnInit {
  private readonly apiService: ApiService = inject(ApiService);
  private readonly classMapperService: ClassMapperService = inject(ClassMapperService);
  private readonly overlayService: OverlayService = inject(OverlayService);

  opened: WritableSignal<boolean> = signal<boolean>(false);
  selectedIdTag: number | null = null;
  selectedTag: WritableSignal<Tag | null> = signal<Tag | null>(null);
  selectedTab: number = 0;

  tags: WritableSignal<Tag[]> = signal<Tag[]>([]);
  entries: WritableSignal<Entry[]> = signal<Entry[]>([]);

  ngOnInit(): void {
    this.loadHome();
  }

  showMenu(): void {
    this.opened.set(true);
  }

  loadHome(): void {
    this.apiService.getHome(this.selectedIdTag).subscribe((response: HomeResult): void => {
      if (response.status === ApiStatus.OK) {
        this.tags.set(this.classMapperService.getTags(response.tags));
        this.entries.set(this.classMapperService.getEntries(response.entries));
        if (response.tag !== null) {
          this.selectedTag.set(this.classMapperService.getTag(response.tag));
        } else {
          this.selectedTag.set(null);
        }
      }
    });
  }

  selectTag(tag: Tag): void {
    this.selectedIdTag = tag.id;
    this.loadHome();
  }

  back(): void {
    const selectedTag: Tag | null = this.selectedTag();
    if (selectedTag === null) {
      return;
    }
    this.selectedIdTag = selectedTag.idParent;
    this.loadHome();
  }

  selectEntry(entry: Entry): void {
    console.log(entry);
  }

  add(): void {
    if (this.selectedTab === 0) {
      this.addTag();
    }
  }

  addTag(): void {
    const modalDescuentoData: Modal = {
      modalTitle: 'Añadir etiqueta',
      modalColor: 'blue',
    };
    const dialog = this.overlayService.open(AddTag, modalDescuentoData);
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        console.log(data.data);
        this.apiService
          .addTag(this.selectedIdTag, data.data.name)
          .subscribe((response: TagResult): void => {
            if (response.status === ApiStatus.OK) {
              this.tags.set([...this.tags(), this.classMapperService.getTag(response.tag)]);
            }
          });
      }
    });
  }
}
