import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatActionList, MatListItem, MatListItemIcon, MatNavList } from '@angular/material/list';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import NavigationService from '@app/services/navigation.service';
import ApiStatus from '@enum/api-status.enum';
import { HomeResult, StatusResult } from '@interfaces/interfaces';
import { EditTagData, TagInterface, TagResult } from '@interfaces/tag.interfaces';
import Entry from '@model/entry.model';
import Tag from '@model/tag.model';
import { DialogService, Modal, OverlayService } from '@osumi/angular-tools';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import AddTag from '@shared/add-tag/add-tag';
import EditTag from '@shared/edit-tag/edit-tag';

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
  private readonly dialog: DialogService = inject(DialogService);
  private readonly navigationService: NavigationService = inject(NavigationService);
  private readonly router: Router = inject(Router);

  opened: WritableSignal<boolean> = signal<boolean>(false);
  selectedIdTag: number | null = null;
  selectedTag: WritableSignal<Tag | null> = signal<Tag | null>(null);
  selectedTab: number = 0;

  tags: WritableSignal<Tag[]> = signal<Tag[]>([]);
  entries: WritableSignal<Entry[]> = signal<Entry[]>([]);

  ngOnInit(): void {
    const idTagFromNavigation: number | null = this.navigationService.getFromIdTag();
    if (idTagFromNavigation !== null) {
      this.selectedIdTag = idTagFromNavigation;
      this.navigationService.setFromIdTag(null);
    }
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
    this.navigationService.setFromIdTag(this.selectedIdTag);
    this.router.navigate(['/entry', entry.id]);
  }

  add(): void {
    if (this.selectedTab === 0) {
      this.addTag();
    }
    if (this.selectedTab === 1) {
      this.navigationService.setFromIdTag(this.selectedIdTag);
      this.router.navigate(['/edit-entry/new']);
    }
  }

  addTag(): void {
    const modalAddData: Modal = {
      modalTitle: 'Añadir etiqueta',
      modalColor: 'blue',
    };
    const dialog = this.overlayService.open(AddTag, modalAddData);
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
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

  editTag(): void {
    const modalEditData: EditTagData = {
      modalTitle: 'Editar etiqueta',
      modalColor: 'blue',
      tag: this.selectedTag()?.toInterface() as TagInterface,
    };
    const dialog = this.overlayService.open(EditTag, modalEditData);
    dialog.afterClosed$.subscribe((data): void => {
      if (data.data !== null) {
        this.apiService.editTag(data.data.tag).subscribe((response: TagResult): void => {
          console.log({ response });
          if (response.status === ApiStatus.OK) {
            const newTag: Tag = this.classMapperService.getTag(response.tag);
            console.log({ newTag });
            this.selectedTag.set(newTag);
          }
        });
      }
    });
  }

  deleteTag(): void {
    this.dialog
      .confirm({
        title: 'Confirmar',
        content: '¿Estas seguro de querer borrar la etiqueta "' + this.selectedTag()?.name + '"?',
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.apiService
            .deleteTag(this.selectedTag()?.id as number)
            .subscribe((result: StatusResult): void => {
              if (result.status === ApiStatus.OK) {
                this.back();
              } else {
                this.dialog.alert({
                  title: 'Error',
                  content: 'Ocurrió un error al borrar la etiqueta.',
                });
              }
            });
        }
      });
  }
}
