import {Component, OnDestroy, OnInit} from '@angular/core';
import {MobileService} from "../../../../../service/mobile.service";
import {AgrupadorRepository} from "../../../../../repository/agrupador.repository";
import {Agrupador} from "../../../../../../../web/domain/entity/avaliacao/agrupador.model";
import {Avaliacao} from "../../../../../../../web/domain/entity/avaliacao/avaliacao.model";
import {viewAnimation} from "../../../../../../../web/domain/presentation/controls/utils";

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
