import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export default class NavigationService {
  private fromIdTag: number | null = null;

  setFromIdTag(idTag: number | null): void {
    this.fromIdTag = idTag;
  }

  getFromIdTag(): number | null {
    return this.fromIdTag;
  }
}
