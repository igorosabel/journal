import { Injectable } from '@angular/core';
import { LoginData, LoginResult, RegisterData, RegisterResult } from '@interfaces/interfaces';
import ApiBaseService from '@services/api-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class ApiUsersService extends ApiBaseService {
  login(data: LoginData): Observable<LoginResult> {
    return this.http.post<LoginResult>(this.apiUrl + 'login', data);
  }

  register(data: RegisterData): Observable<RegisterResult> {
    return this.http.post<RegisterResult>(this.apiUrl + 'register', data);
  }
}
