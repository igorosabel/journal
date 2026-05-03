import { Injectable, inject } from '@angular/core';
import ApiStatus from '@enum/api-status.enum';
import { LoginResult } from '@interfaces/interfaces';
import User from '@model/user.model';
import ClassMapperService from '@services/class-mapper.service';

@Injectable({
  providedIn: 'root',
})
export default class UserService {
  private cms: ClassMapperService = inject(ClassMapperService);

  logged: boolean = false;
  user: User | null = null;

  loadLogin(): void {
    try {
      const loginStr: string | null = localStorage.getItem('login');
      if (loginStr === null) {
        this.logout();
        return;
      }
      const loginObj: LoginResult = JSON.parse(loginStr);
      if (loginObj === null) {
        this.logout();
        return;
      }
      this.logged = true;
      this.user = this.cms.getUser(loginObj.user);
    } catch (e) {
      console.error('Error cargando datos de inicio:', e);
      this.logout();
    }
  }

  saveLogin(): void {
    if (this.user === null) {
      return;
    }
    const loginObj: LoginResult = {
      status: ApiStatus.OK,
      user: this.user.toInterface(),
    };
    localStorage.setItem('login', JSON.stringify(loginObj));
  }

  logout(): void {
    this.logged = false;
    this.user = null;
    localStorage.removeItem('login');
  }
}
