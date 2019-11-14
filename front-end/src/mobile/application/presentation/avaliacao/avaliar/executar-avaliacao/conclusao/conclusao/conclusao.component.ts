import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {viewAnimation} from '@src/sistema/application/presentation/controls/utils';
import {MobileService} from '@src/mobile/domain/service/mobile.service';
import {AgrupadorRepository} from '@src/mobile/domain/repository/agrupador.repository';
import {Agrupador} from '@src/sistema/domain/entity/avaliacao/agrupador.model';
import {Avaliacao} from '@src/sistema/domain/entity/avaliacao/avaliacao.model';
import {Dispositivo} from '@src/sistema/domain/entity/avaliacao/dispositivo.model';

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

    // if (!this.mobileService.agrupador.recap) {
    //   this.router.navigate(['avaliar/' + this.mobileService.dispositivo.id + '/' + this.activatedRoute.parent.parent.snapshot.params.unidadeId + '/conclusao/robot-verify']);
    //   return
    // }

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
