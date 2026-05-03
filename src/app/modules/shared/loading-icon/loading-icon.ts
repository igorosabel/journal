import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-loading-icon',
  templateUrl: './loading-icon.html',
})
export default class LoadingIcon {
  show: InputSignal<boolean> = input.required<boolean>();
}
