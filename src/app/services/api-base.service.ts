import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export default class ApiBaseService {
  http: HttpClient = inject(HttpClient);

  apiUrl: string = environment.apiUrl;
}
