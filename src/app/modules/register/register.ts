import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { disabled, form, FormField, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import ApiStatus from '@enum/api-status.enum';
import { RegisterData, RegisterResult } from '@interfaces/interfaces';
import User from '@model/user.model';
import ApiUsersService from '@services/api-users.service';
import UserService from '@services/user.service';
import LoadingIcon from '@shared/loading-icon/loading-icon';

@Component({
  selector: 'app-register',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    LoadingIcon,
    FormField,
    RouterLink,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export default class Register implements OnInit {
  private readonly aus: ApiUsersService = inject(ApiUsersService);
  private readonly us: UserService = inject(UserService);
  private readonly router: Router = inject(Router);

  registerModel: WritableSignal<RegisterData> = signal<RegisterData>({
    name: '',
    pass: '',
    conf: '',
  });
  registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.pass);
    required(schemaPath.conf);
    disabled(schemaPath.name, (): boolean => this.loading());
    disabled(schemaPath.pass, (): boolean => this.loading());
    disabled(schemaPath.conf, (): boolean => this.loading());
  });
  isValid: Signal<boolean> = computed(
    (): boolean =>
      this.registerForm.name().errors().length === 0 &&
      this.registerForm.pass().errors().length === 0 &&
      this.registerForm.conf().errors().length === 0,
  );
  registerError: WritableSignal<boolean> = signal<boolean>(false);
  loading: WritableSignal<boolean> = signal<boolean>(false);

  username: Signal<ElementRef> = viewChild.required('username');

  ngOnInit(): void {
    if (this.us.logged) {
      this.router.navigate(['/home']);
    }
    this.username().nativeElement.focus();
  }

  register(): void {
    if (!this.isValid()) {
      return;
    }
    this.registerError.set(false);
    this.loading.set(true);

    this.aus.register(this.registerModel()).subscribe({
      next: (result: RegisterResult): void => {
        if (result.status === ApiStatus.OK) {
          this.us.logged = true;
          this.us.user = new User().fromInterface(result.user);
          this.us.saveLogin();

          this.router.navigate(['/home']);
        } else {
          this.loading.set(false);
          this.registerError.set(true);
        }
      },
      error: (): void => {
        this.loading.set(false);
        this.registerError.set(true);
      },
    });
  }
}
