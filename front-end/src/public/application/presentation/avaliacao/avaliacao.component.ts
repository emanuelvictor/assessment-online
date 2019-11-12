import {Component} from '@angular/core';
import {environment} from '@src/environments/environment';
import {getIdentifier} from '@src/sistema/application/presentation/controls/utils';
import {PublicService} from '@src/public/domain/service/public.service';

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
   * @param publicService
   */
  constructor(public publicService: PublicService) {
    if (publicService.dispositivo && publicService.dispositivo.tenant) {
      // tslint:disable-next-line:max-line-length
      this.backgroundImage = environment.endpoint + './configuracoes/background?cliente=' + publicService.dispositivo.tenant + '?nocache=' + getIdentifier();
    }
  }

}
