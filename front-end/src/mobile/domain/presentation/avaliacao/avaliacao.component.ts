import {Component} from '@angular/core';
import {getIdentifier} from "../../../../web/domain/presentation/controls/utils";
import {environment} from "../../../../environments/environment";
import {AuthenticationService} from "../../../../web/domain/service/authentication.service";
import {Route, Router} from "@angular/router";
import {OpcoesDeConfiguracaoComponent} from "./configurar/configuracoes/opcoes-de-configuracao/opcoes-de-configuracao.component";

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
    // this.router.events.subscribe((val) => {
    //   this.authenticationService.requestContaAutenticada()
    //     .subscribe(conta => {
    //         if (conta && conta.esquema) {
    //           this.backgroundImage = environment.endpoint + './configuracoes/background?cliente=' + conta.esquema + '?nocache=' + getIdentifier()
    //         }
    //       }
    //     )
    // })
  }

}
