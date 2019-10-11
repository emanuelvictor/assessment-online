import {Component} from '@angular/core';
import {viewAnimation} from '@src/web/domain/presentation/controls/utils';

@Component({
  selector: 'conclusao-view',
  templateUrl: './conclusao-view.component.html',
  styleUrls: ['./conclusao-view.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class ConclusaoViewComponent {

  /**
   *
   */
  constructor() {
  }

}
