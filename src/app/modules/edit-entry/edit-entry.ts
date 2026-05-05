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
import Entry from '@model/entry.model';

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
  ],
  templateUrl: './edit-entry.html',
  styleUrl: './edit-entry.scss',
})
export default class EditEntry implements OnInit {
  private readonly router: Router = inject(Router);

  id: InputSignal<string> = input.required<string>();
  title: WritableSignal<string> = signal<string>('Nueva entrada');
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
    console.log('save', this.entry);
  }
}
