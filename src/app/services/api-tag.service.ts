import { Injectable } from '@angular/core';
import { StatusResult } from '@interfaces/interfaces';
import { TagInterface, TagResult, TagsResult } from '@interfaces/tag.interfaces';
import ApiBaseService from '@services/api-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class ApiTagService extends ApiBaseService {
  getTags(idParent: number | null): Observable<TagsResult> {
    return this.http.post<TagsResult>(this.apiUrl + 'get-tags', { idParent });
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
