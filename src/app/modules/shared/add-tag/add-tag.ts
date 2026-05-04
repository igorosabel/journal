import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  Signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CustomOverlayRef } from '@osumi/angular-tools';
import LoadingIcon from '@shared/loading-icon/loading-icon';

@Component({
  selector: 'app-add-tag',
  imports: [MatFormField, MatLabel, MatInput, MatButton, FormsModule, LoadingIcon],
  templateUrl: './add-tag.html',
  styleUrl: './add-tag.scss',
})
export default class AddTag implements OnInit {
  private readonly customOverlayRef: CustomOverlayRef<null, { name: string }> =
    inject(CustomOverlayRef);

  tagName: string = '';
  validate: WritableSignal<boolean> = signal<boolean>(true);
  loading: WritableSignal<boolean> = signal<boolean>(false);
  name: Signal<ElementRef> = viewChild.required<ElementRef>('name');

  ngOnInit(): void {
    this.name().nativeElement.focus();
  }

  addTag(): void {
    this.validate.set(true);
    if (this.tagName.trim() === '') {
      this.validate.set(false);
      this.name().nativeElement.focus();
      return;
    }
    this.loading.set(true);
    this.customOverlayRef.close({ name: this.tagName });
  }
}
