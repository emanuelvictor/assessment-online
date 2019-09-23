import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {environment} from "../../../../../../environments/environment";
import {getIdentifier} from "../../../../../../web/domain/presentation/controls/utils";
import {MobileService} from "../../../../service/mobile.service";

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss']
})
export class ConfiguracoesComponent {
  /**
   *
   */
  backgroundImage: string = null;

  /**
   *
   * @param router
   * @param {MobileService} mobileService
   */
  constructor(private router: Router,
              private mobileService: MobileService) {

    this.mobileService.requestDispositivoAutenticada().subscribe(dispositivo => {
      if (dispositivo && dispositivo.tenant) {
        this.backgroundImage = environment.endpoint + './configuracoes/background?cliente=' + dispositivo.tenant + '?nocache=' + getIdentifier()
      }
    })
  }

}
