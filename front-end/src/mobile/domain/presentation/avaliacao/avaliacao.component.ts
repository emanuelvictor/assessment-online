import {Component} from '@angular/core';
import {getIdentifier} from "../../../../web/domain/presentation/controls/utils";
import {environment} from "../../../../environments/environment";
import {AuthenticationService} from "../../../../web/domain/service/authentication.service";
import {Router} from "@angular/router";

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
