import {Component, OnDestroy, OnInit} from '@angular/core';
import {MobileService} from "../../../../../service/mobile.service";
import {AgrupadorRepository} from "../../../../../repository/agrupador.repository";
import {Agrupador} from "../../../../../../../web/domain/entity/avaliacao/agrupador.model";
import {Avaliacao} from "../../../../../../../web/domain/entity/avaliacao/avaliacao.model";
import {viewAnimation} from "../../../../../../../web/domain/presentation/controls/utils";

@Component({
  selector: 'app-conclusao',
  templateUrl: './conclusao.component.html',
  styleUrls: ['./conclusao.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class ConclusaoComponent implements OnInit, OnDestroy {

  /**
   *
   * @param mobileService
   * @param agrupadorRepository
   */
  constructor(public mobileService: MobileService,
              private agrupadorRepository: AgrupadorRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    // Registra o loading e restarta o timeout
    this.mobileService.register('overlayStarSyntax');
    this.mobileService.restartTimeout();

    const agrupador: Agrupador = Object.assign({}, this.mobileService.agrupador);

    this.mobileService.agrupador.avaliacoes.forEach(value => value.agrupador = null);

    agrupador.avaliacoes = this.mobileService.agrupador.avaliacoes;

    agrupador.avaliacoes.forEach(avaliacao => {
      const copy: Avaliacao = Object.assign({}, avaliacao);
      copy.avaliacoesAvaliaveis = [];
      avaliacao.avaliacoesAvaliaveis.forEach(avaliacaoAvaliavel => {
        avaliacaoAvaliavel.avaliacao = copy
      })
    });

    // Salva o agrupador, e as avaliações com seus avaliaveis por cascade.
    this.agrupadorRepository.save(agrupador).then(() => {
      this.mobileService.resolve('overlayStarSyntax')
    }).catch(() => {
      this.mobileService.resolve('overlayStarSyntax')
    })
    // // Workarround
    // // Tempo de espera padrão para concluir o timeout.
    // // Isso se reflete na experiência do usuário
    // setTimeout(() => {
    //   this._loadingService.resolve('overlayStarSyntax')
    // }, 300)
  }

  /**
   *
   */
  ngOnDestroy(): void {
    // Resolve o loading.
    this.mobileService.resolve('overlayStarSyntax')
  }
}
