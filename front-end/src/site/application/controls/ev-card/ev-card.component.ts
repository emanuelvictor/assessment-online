import {Component, Input} from '@angular/core';

@Component({
  selector: 'ev-card',
  templateUrl: './ev-card.component.html',
  styleUrls: ['./ev-card.component.scss']
})
export class EvCardComponent {

  @Input()
  object: any;

  constructor() {
  }

}
