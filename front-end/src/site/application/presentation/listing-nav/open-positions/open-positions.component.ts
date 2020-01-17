import {Component, Input} from '@angular/core';
import {Plano} from '@src/sistema/domain/entity/assinatura/plano.model';

@Component({
  selector: 'sistema-open-positions',
  templateUrl: './open-positions.component.html',
  styleUrls: ['./open-positions.component.scss']
})
export class OpenPositionsComponent {

  @Input()
  plano: Plano;

}
