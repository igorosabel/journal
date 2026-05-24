import {
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import ApiStatus from '@enum/api-status.enum';
import { EntryResult } from '@interfaces/entry.interfaces';
import Entry from '@model/entry.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import TagTreeSelector from '@shared/tag-tree-selector/tag-tree-selector';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-edit-entry',
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatIconButton,
    MatIcon,
    MatTabGroup,
    MatTab,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    QuillEditorComponent,
    TagTreeSelector,
  ],
  templateUrl: './edit-entry.html',
  styleUrl: './edit-entry.scss',
})
export default class EditEntry implements OnInit {
  private readonly apiService: ApiService = inject(ApiService);
  private readonly classMapperService: ClassMapperService = inject(ClassMapperService);
  private readonly router: Router = inject(Router);

  id: InputSignal<string> = input.required<string>();
  title: WritableSignal<string> = signal<string>('Nueva entrada');
  titleError: WritableSignal<boolean> = signal<boolean>(false);
  bodyError: WritableSignal<boolean> = signal<boolean>(false);
  saveError: WritableSignal<boolean> = signal<boolean>(false);
  loading: WritableSignal<boolean> = signal<boolean>(false);
  entry: Entry = new Entry();
  selectedTab: number = 0;

  ngOnInit(): void {
    console.log(this.id());
    if (this.id() !== 'new') {
      this.title.set('Editar entrada');
    }
  }

  back(): void {
    this.router.navigate(['/home']);
  }

  save(): void {
    if (this.loading()) {
      return;
    }

    if (this.validate() === false) {
      return;
    }

    this.saveError.set(false);
    this.loading.set(true);

    this.apiService.saveEntry(this.entry.toInterface()).subscribe({
      next: (result: EntryResult): void => {
        this.loading.set(false);

        if (result.status === ApiStatus.OK) {
          this.entry = this.classMapperService.getEntry(result.entry);
          this.router.navigate(['/entry', this.entry.id]);
        } else {
          this.showSaveError();
        }
      },
      error: (): void => {
        this.loading.set(false);
        this.showSaveError();
      },
    });
  }

  private validate(): boolean {
    const titleValid: boolean = this.hasText(this.entry.title);
    const bodyValid: boolean = this.hasRichText(this.entry.body);

    this.titleError.set(!titleValid);
    this.bodyError.set(!bodyValid);

    if (titleValid === false) {
      this.selectedTab = 0;
      return false;
    }

    if (bodyValid === false) {
      this.selectedTab = 1;
      return false;
    }

    return true;
  }

  private showSaveError(): void {
    this.selectedTab = 1;
    this.saveError.set(true);
  }

  private hasText(value: string | null): boolean {
    return (value ?? '').trim().length > 0;
  }

  private hasRichText(value: string | null): boolean {
    const plainText: string = (value ?? '')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();

    return plainText.length > 0;
  }
}
