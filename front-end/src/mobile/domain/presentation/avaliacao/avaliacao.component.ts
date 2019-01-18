import {Component} from '@angular/core';
import {getIdentifier} from "../../../../web/domain/presentation/controls/utils";
import {environment} from "../../../../environments/environment";
import {AuthenticationService} from "../../../../web/domain/service/authentication.service";

@Component({
  selector: 'app-avaliacao',
  templateUrl: './avaliacao.component.html',
  styleUrls: ['./avaliacao.component.scss']
})
export class AvaliacaoComponent {

  /**
   *
   */
  backgroundImage: string = null;

  /**
   *
   * @param {AuthenticationService} authenticationService
   */
  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.requestContaAutenticada()
      .subscribe(conta => {
          if (conta && conta.esquema)
            this.backgroundImage = environment.endpoint + './configuracoes/background?cliente=' + conta.esquema + '?nocache=' + getIdentifier()
        }
      )
  }

}
