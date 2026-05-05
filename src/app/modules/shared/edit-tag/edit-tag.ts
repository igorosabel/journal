import {
  Component,
  ElementRef,
  inject,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TagInterface } from '@interfaces/tag.interfaces';
import Tag from '@model/tag.model';
import { CustomOverlayRef } from '@osumi/angular-tools';
import LoadingIcon from '@shared/loading-icon/loading-icon';

@Component({
  selector: 'app-edit-tag',
  imports: [MatFormField, MatLabel, MatInput, MatButton, FormsModule, LoadingIcon],
  templateUrl: './edit-tag.html',
  styleUrl: './edit-tag.scss',
})
export default class EditTag implements OnInit {
  private readonly customOverlayRef: CustomOverlayRef<null, { tag: TagInterface }> =
    inject(CustomOverlayRef);

  tag: Tag = new Tag().fromInterface(this.customOverlayRef.data.tag);
  validate: WritableSignal<boolean> = signal<boolean>(true);
  loading: WritableSignal<boolean> = signal<boolean>(false);
  name: Signal<ElementRef> = viewChild.required<ElementRef>('name');

  ngOnInit(): void {
    this.name().nativeElement.focus();
  }

  editTag(): void {
    this.validate.set(true);
    if (this.tag.name === null || this.tag.name.trim() === '') {
      this.validate.set(false);
      this.name().nativeElement.focus();
      return;
    }
    this.loading.set(true);
    this.customOverlayRef.close({ tag: this.tag.toInterface() });
  }
}
