import {Component} from '@angular/core';
import {getIdentifier} from "../../../../web/domain/presentation/controls/utils";
import {environment} from "../../../../environments/environment";
import {AuthenticationService} from "../../../../web/domain/service/authentication.service";
import {ConfiguracaoRepository} from "../../../../web/domain/repositories/configuracao.repository";

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
   * @param {ConfiguracaoRepository} configuracaoRepository
   */
  constructor(private authenticationService: AuthenticationService, private configuracaoRepository: ConfiguracaoRepository) {
    this.authenticationService.requestContaAutenticada()
      .subscribe(conta =>
        this.backgroundImage = environment.endpoint + './configuracoes/background?cliente=' + conta.esquema + '?nocache=' + getIdentifier()
      )

  }

}
