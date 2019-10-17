import {Component} from '@angular/core';
import {MobileService} from "../../service/mobile.service";
import {environment} from "../../../../environments/environment";
import {getIdentifier} from "../../../../web/domain/presentation/controls/utils";

@Component({
  selector: 'app-avaliacao',
  templateUrl: './avaliacao.component.html',
  styleUrls: ['./avaliacao.component.scss']
})
export class AvaliacaoComponent {

  /**
   *
   */
  backgroundImage: string = './configuracoes/background?cliente=public';

  /**
   *
   * @param mobileService
   */
  constructor(public mobileService: MobileService) {
    if (mobileService.dispositivo && mobileService.dispositivo.tenant)
      this.backgroundImage = environment.endpoint + './configuracoes/background?cliente=' + mobileService.dispositivo.tenant + '?nocache=' + getIdentifier()
  }

}
