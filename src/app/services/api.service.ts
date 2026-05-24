import { Injectable } from '@angular/core';
import { EntryInterface, EntryResult } from '@interfaces/entry.interfaces';
import { HomeResult, StatusResult } from '@interfaces/interfaces';
import { TagInterface, TagResult, TagsResult } from '@interfaces/tag.interfaces';
import ApiBaseService from '@services/api-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class ApiService extends ApiBaseService {
  getHome(idParent: number | null): Observable<HomeResult> {
    return this.http.post<HomeResult>(this.apiUrl + 'get-home', { idParent });
  }

  getTags(idParent: number | null): Observable<TagsResult> {
    return this.http.post<TagsResult>(this.apiUrl + 'get-tags', { idParent });
  }

  saveEntry(entry: EntryInterface): Observable<EntryResult> {
    return this.http.post<EntryResult>(this.apiUrl + 'save-entry', entry);
  }

  addTag(idParent: number | null, name: string): Observable<TagResult> {
    return this.http.post<TagResult>(this.apiUrl + 'add-tag', { idParent, name });
  }

  editTag(tag: TagInterface): Observable<TagResult> {
    return this.http.post<TagResult>(this.apiUrl + 'edit-tag', tag);
  }

  deleteTag(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(this.apiUrl + 'delete-tag', { id });
  }
}
