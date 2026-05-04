import { Injectable } from '@angular/core';
import { HomeResult } from '@interfaces/interfaces';
import { TagResult } from '@interfaces/tag.interfaces';
import ApiBaseService from '@services/api-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class ApiService extends ApiBaseService {
  getHome(idParent: number | null): Observable<HomeResult> {
    return this.http.post<HomeResult>(this.apiUrl + 'get-home', { idParent });
  }

  addTag(idParent: number | null, name: string): Observable<TagResult> {
    return this.http.post<TagResult>(this.apiUrl + 'add-tag', { idParent, name });
  }
}
