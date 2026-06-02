import { Injectable } from '@angular/core';
import { EntryInterface, EntryResult } from '@interfaces/entry.interfaces';
import ApiBaseService from '@services/api-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class ApiEntryService extends ApiBaseService {
  saveEntry(entry: EntryInterface): Observable<EntryResult> {
    return this.http.post<EntryResult>(this.apiUrl + 'save-entry', entry);
  }

  getEntry(id: number): Observable<EntryResult> {
    return this.http.post<EntryResult>(this.apiUrl + 'get-entry', { id });
  }
}
