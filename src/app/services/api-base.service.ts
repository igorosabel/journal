import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { environment } from '@env/environment';

@Service()
export default class ApiBaseService {
  http: HttpClient = inject(HttpClient);

  apiUrl: string = environment.apiUrl;
}
