import {Component} from '@angular/core';
import {MobileService} from '@src/mobile/domain/service/mobile.service';
import {environment} from '@src/environments/environment';
import {getIdentifier} from '@src/web/domain/presentation/controls/utils';

@Component({
  selector: 'app-avaliacao',
  templateUrl: './avaliacao.component.html',
  styleUrls: ['./avaliacao.component.scss']
})
export class AvaliacaoComponent {

  /**
   *
   */
  backgroundImage = './configuracoes/background?cliente=public';

  /**
   *
   * @param mobileService
   */
  constructor(public mobileService: MobileService) {
    if (mobileService.dispositivo && mobileService.dispositivo.tenant) {
      // tslint:disable-next-line:max-line-length
      this.backgroundImage = environment.endpoint + './configuracoes/background?cliente=' + mobileService.dispositivo.tenant + '?nocache=' + getIdentifier();
    }
  }

}
