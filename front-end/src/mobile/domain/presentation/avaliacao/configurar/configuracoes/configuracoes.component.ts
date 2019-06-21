import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../../../../web/domain/service/authentication.service";
import {environment} from "../../../../../../environments/environment";
import {getIdentifier} from "../../../../../../web/domain/presentation/controls/utils";

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
   * @param {AuthenticationService} authenticationService
   */
  constructor(private router: Router,
              private authenticationService: AuthenticationService) {

    this.authenticationService.requestContaAutenticada()
      .subscribe(conta => {
          if (conta && conta.esquema) {
            this.backgroundImage = environment.endpoint + './configuracoes/background?cliente=' + conta.esquema + '?nocache=' + getIdentifier()
          }
        }
      )
  }

}
