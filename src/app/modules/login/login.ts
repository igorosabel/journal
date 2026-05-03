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
import { LoginData, LoginResult } from '@interfaces/interfaces';
import ApiStatus from '@model/enum/api-status.enum';
import User from '@model/user.model';
import ApiUsersService from '@services/api-users.service';
import UserService from '@services/user.service';
import LoadingIcon from '@shared/loading-icon/loading-icon';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export default class LoginComponent implements OnInit {
  private readonly aus: ApiUsersService = inject(ApiUsersService);
  private readonly us: UserService = inject(UserService);
  private readonly router: Router = inject(Router);

  loginModel: WritableSignal<LoginData> = signal<LoginData>({
    name: '',
    pass: '',
  });
  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.pass);
    disabled(schemaPath.name, (): boolean => this.loading());
    disabled(schemaPath.pass, (): boolean => this.loading());
  });
  isValid: Signal<boolean> = computed(
    (): boolean =>
      this.loginForm.name().errors().length === 0 && this.loginForm.pass().errors().length === 0,
  );
  loginError: WritableSignal<boolean> = signal<boolean>(false);
  loading: WritableSignal<boolean> = signal<boolean>(false);

  username: Signal<ElementRef> = viewChild.required('username');

  ngOnInit(): void {
    if (this.us.logged) {
      this.router.navigate(['/home']);
    }
    this.username().nativeElement.focus();
  }

  login(): void {
    if (!this.isValid()) {
      return;
    }
    this.loginError.set(false);
    this.loading.set(true);

    this.aus.login(this.loginModel()).subscribe({
      next: (result: LoginResult): void => {
        if (result.status === ApiStatus.OK) {
          this.us.logged = true;
          this.us.user = new User().fromInterface(result.user);
          this.us.saveLogin();

          this.router.navigate(['/home']);
        } else {
          this.loading.set(false);
          this.loginError.set(true);
        }
      },
      error: (): void => {
        this.loading.set(false);
        this.loginError.set(true);
      },
    });
  }
}
