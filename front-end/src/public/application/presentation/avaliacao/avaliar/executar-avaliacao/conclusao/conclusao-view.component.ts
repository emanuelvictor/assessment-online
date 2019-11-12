import {Component} from '@angular/core';
import {viewAnimation} from '@src/sistema/application/presentation/controls/utils';

@Component({
  selector: 'conclusao-view',
  templateUrl: './conclusao-view.component.html',
  styleUrls: ['./conclusao-view.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class ConclusaoViewComponent {

}
