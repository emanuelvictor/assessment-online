import {Component, OnDestroy, OnInit} from '@angular/core';
import {AgrupadorRepository} from "../../../../../../repository/agrupador.repository";
import {MobileService} from "../../../../../../service/mobile.service";
import {Agrupador} from "../../../../../../../../web/domain/entity/avaliacao/agrupador.model";
import {Avaliacao} from "../../../../../../../../web/domain/entity/avaliacao/avaliacao.model";
import {viewAnimation} from "../../../../../../../../web/domain/presentation/controls/utils";
import {ActivatedRoute, Router} from "@angular/router";
import {Dispositivo} from "../../../../../../../../web/domain/entity/avaliacao/dispositivo.model";

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
   * @param router
   * @param mobileService
   * @param activatedRoute
   * @param agrupadorRepository
   */
  constructor(private router: Router,
              public mobileService: MobileService,
              private activatedRoute: ActivatedRoute,
              private agrupadorRepository: AgrupadorRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    // Registra o loading e restarta o timeout
    this.mobileService.register('overlayStarSyntax');
    this.mobileService.restartTimeout();

    if (!this.mobileService.dispositivo.interna && !this.mobileService.agrupador.recap) {
      this.router.navigate(['avaliar/' + this.mobileService.dispositivo.numeroLicenca + '/' + this.activatedRoute.parent.parent.snapshot.params.unidadeId + '/conclusao/robot-verify']);
      return
    }

    const agrupador: Agrupador = Object.assign({}, this.mobileService.agrupador);

    this.mobileService.agrupador.avaliacoes.forEach(value => value.agrupador = null);

    agrupador.avaliacoes = this.mobileService.agrupador.avaliacoes;

    agrupador.avaliacoes.forEach(avaliacao => {
      const copy: Avaliacao = Object.assign({}, avaliacao);
      copy.avaliacoesAvaliaveis = [];
      avaliacao.avaliacoesAvaliaveis.forEach(avaliacaoAvaliavel => {
        avaliacaoAvaliavel.avaliacao = copy;
        avaliacaoAvaliavel.avaliavel.unidadeTipoAvaliacaoDispositivo.dispositivo = new Dispositivo(this.mobileService.dispositivo.id);
        avaliacaoAvaliavel.avaliavel.unidadeTipoAvaliacaoDispositivo.dispositivo.tenant = this.mobileService.dispositivo.tenant;
      })
    });

    // Salva o agrupador, e as avaliações com seus avaliaveis por cascade.
    this.agrupadorRepository.save(agrupador).then(() => {
      this.mobileService.resolve('overlayStarSyntax')
    }).catch(() => {
      this.mobileService.resolve('overlayStarSyntax')
    })
  }

  /**
   *
   */
  ngOnDestroy(): void {
    // Resolve o loading.
    this.mobileService.resolve('overlayStarSyntax')
  }
}