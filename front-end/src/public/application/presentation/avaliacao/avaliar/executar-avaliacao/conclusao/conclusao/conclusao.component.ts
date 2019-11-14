import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {viewAnimation} from '@src/sistema/application/presentation/controls/utils';
import {PublicService} from '@src/public/domain/service/public.service';
import {AgrupadorRepository} from '@src/public/domain/repository/agrupador.repository';
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
   * @param publicService
   * @param activatedRoute
   * @param agrupadorRepository
   */
  constructor(private router: Router,
              public publicService: PublicService,
              private activatedRoute: ActivatedRoute,
              private agrupadorRepository: AgrupadorRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    // Registra o loading e restarta o timeout
    this.publicService.register('overlayStarSyntax');
    this.publicService.restartTimeout();

    if (!this.publicService.agrupador.recap) {
      this.router.navigate(['avaliar/' + this.publicService.dispositivo.id + '/' + this.activatedRoute.parent.parent.snapshot.params.unidadeId + '/conclusao/robot-verify']);
      return
    }

    const agrupador: Agrupador = Object.assign({}, this.publicService.agrupador);

    this.publicService.agrupador.avaliacoes.forEach(value => value.agrupador = null);

    agrupador.avaliacoes = this.publicService.agrupador.avaliacoes;

    agrupador.avaliacoes.forEach(avaliacao => {
      const copy: Avaliacao = Object.assign({}, avaliacao);
      copy.avaliacoesAvaliaveis = [];
      avaliacao.avaliacoesAvaliaveis.forEach(avaliacaoAvaliavel => {
        avaliacaoAvaliavel.avaliacao = copy;
        avaliacaoAvaliavel.avaliavel.unidadeTipoAvaliacaoDispositivo.dispositivo = new Dispositivo(this.publicService.dispositivo.id);
        avaliacaoAvaliavel.avaliavel.unidadeTipoAvaliacaoDispositivo.dispositivo.tenant = this.publicService.dispositivo.tenant;
      })
    });

    // Salva o agrupador, e as avaliações com seus avaliaveis por cascade.
    this.agrupadorRepository.save(agrupador).then(() => {
      this.publicService.resolve('overlayStarSyntax')
    }).catch(() => {
      this.publicService.resolve('overlayStarSyntax')
    })
  }

  /**
   *
   */
  ngOnDestroy(): void {
    // Resolve o loading.
    this.publicService.resolve('overlayStarSyntax')
  }
}
