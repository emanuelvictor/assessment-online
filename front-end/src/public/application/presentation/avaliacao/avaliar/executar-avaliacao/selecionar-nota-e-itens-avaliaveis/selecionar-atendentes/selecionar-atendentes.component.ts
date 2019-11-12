import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {AvaliavelRepository} from '@src/sistema/domain/repository/avaliavel.repository';
import {PublicService} from '@src/public/domain/service/public.service';
import {UnidadeTipoAvaliacaoRepository} from '@src/sistema/domain/repository/unidade-tipo-avaliacao.repository';
import {Agrupador} from '@src/sistema/domain/entity/avaliacao/agrupador.model';
import {AvaliacaoAvaliavel} from '@src/sistema/domain/entity/avaliacao/avaliacao-avaliavel.model';
import {viewAnimation} from '@src/sistema/application/presentation/controls/utils';

@Component({
  selector: 'selecionar-atendentes',
  templateUrl: './selecionar-atendentes.component.html',
  styleUrls: ['./selecionar-atendentes.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class SelecionarAtendentesComponent implements OnInit, OnDestroy {

  /**
   *
   * @type {Array}
   */
  avaliaveis: any[] = [];

  /**
   *
   */
  unidadesTiposAvaliacoesDispositivo: any;

  /**
   *
   */
  unidadeTipoAvaliacaoDispositivo: any;

  /**
   *
   */
  countTiposAvaliacoes: number;

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {PublicService} publicService
   * @param {ActivatedRoute} activatedRoute
   * @param {AvaliavelRepository} avaliavelRepository
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   */
  constructor(private avaliavelRepository: AvaliavelRepository,
              public publicService: PublicService, private router: Router,
              public activatedRoute: ActivatedRoute, public snackBar: MatSnackBar,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {
  }

  /**
   *
   * @returns {MatSnackBarConfig}
   */
  public static get matSnackBarConfig(): MatSnackBarConfig {
    const matSnackBarConfig: MatSnackBarConfig = new MatSnackBarConfig();
    matSnackBarConfig.duration = 5000;
    return matSnackBarConfig
  }

  /**
   *
   */
  ngOnInit() {

    // Registra o loading e restarta o timeout
    this.publicService.register('overlayStarSyntax');
    this.publicService.restartTimeout();

    // Se não tem avaliações, ou seja, deu F5, então vai pra tela inicial.
    if (!this.publicService.agrupador.avaliacoes || !this.publicService.agrupador.avaliacoes.length || this.publicService.agrupador.avaliacoes.length !== +this.activatedRoute.parent.snapshot.params.ordem) {
      this.publicService.agrupador = new Agrupador();
      this.router.navigate(['avaliar/' + this.publicService.dispositivo.numeroLicenca])
    }

    // Se não tem unidades selecionadas vai para tela de selação de unidades
    if (!this.publicService.dispositivo.unidades || !this.publicService.dispositivo.unidades.length) {
      this.router.navigate(['configuracoes']);
      this.publicService.resolve('overlayStarSyntax');
      return
    }

    // Popula variável de unidadesTiposAvalicoes, esta variável será utilizada na conclusão da avaliaçãavaliaveiso.
    this.unidadesTiposAvaliacoesDispositivo = this.publicService.dispositivo.unidadesTiposAvaliacoesDispositivo;

    // Se não tem unidades selecionadas vai para tela de selação de unidades
    if (!this.publicService.dispositivo.unidadesTiposAvaliacoesDispositivo || !this.publicService.dispositivo.unidadesTiposAvaliacoesDispositivo.length) {
      this.router.navigate(['configuracoes']);
      this.publicService.resolve('overlayStarSyntax');
      return
    }

    // Conta a quantidade de avaliações, utilizado para criar contador na tela.
    this.countTiposAvaliacoes = this.unidadesTiposAvaliacoesDispositivo.filter(unidadeTipoAvaliacaoDispositivo => unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.id === +this.activatedRoute.parent.parent.snapshot.params.unidadeId).length;

    // Se não tem unidadeId, então retorna para seleção de unidade. //TODO pode estar no abstract
    if (!this.activatedRoute.parent.snapshot.params.ordem) {
      this.router.navigate(['configuracoes']);
      this.publicService.resolve('overlayStarSyntax');
      return
    }

    // Se não está configurada a ordem, então volta para a tela inicial de configuração/seleção de unidades e tipos de avaliações vinculadas a essas. //TODO pode estar no abstract
    if (!this.activatedRoute.parent.parent.snapshot.params.unidadeId) {
      this.router.navigate(['avaliar/' + this.publicService.dispositivo.numeroLicenca]);
      this.publicService.resolve('overlayStarSyntax');
      return
    }

    // Pega a unidade filtrada pela ordem e pela unidade
    this.unidadeTipoAvaliacaoDispositivo = this.unidadesTiposAvaliacoesDispositivo.filter(unidadeTipoAvaliacaoDispositivo => {
      return unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.id === +this.activatedRoute.parent.parent.snapshot.params.unidadeId && unidadeTipoAvaliacaoDispositivo.ordem === +this.activatedRoute.parent.snapshot.params.ordem
    })[0];

    this.avaliaveis = this.unidadeTipoAvaliacaoDispositivo.avaliaveis;

    // Deseleciona todos os ítens avaliáveis
    this.avaliaveis.forEach(avaliavel => {
      (avaliavel as any).selected = false
    });

    // Se tem apenas um avaliável
    if (this.avaliaveis.length === 1) {

      // Seleciona o mesmo
      this.avaliaveis[0].selected = true;

      // Conclui a avaliação
      this.proximo()

      // Se não tem avaliáveis, esta errado, pois deve ter avaliáveis.
    } else if (!this.avaliaveis.length) {

      // Então vai para a tela de erro para instruir o usuário
      this.router.navigate(['error'])
    }

    // Resolve loading.
    this.publicService.resolve('overlayStarSyntax')
  }

  /**
   *
   */
  public proximo() {

    // Restarta o timeout
    this.publicService.restartTimeout();

    // Adiciona avaliação TODO
    this.publicService.agrupador.avaliacoes[+this.activatedRoute.parent.snapshot.params.ordem - 1].avaliacoesAvaliaveis = this.avaliaveis.filter(avaliavel => avaliavel.selected).map(value => new AvaliacaoAvaliavel(value, this.publicService.agrupador.avaliacoes[+this.activatedRoute.parent.snapshot.params.ordem - 1]));

    // Se nenhum avaliável foi selecionado, exibe mensagem para seleção.
    if (this.publicService.agrupador.avaliacoes[+this.activatedRoute.parent.snapshot.params.ordem - 1].avaliacoesAvaliaveis.length > 0) {

      // Se a quantidade de unidades tipos avaliações for diferente que a ordem, então as avaliações não chegaram no fim.
      if (this.unidadesTiposAvaliacoesDispositivo.filter(unidadeTipoAvaliacaoDispositivo => unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.id === +this.activatedRoute.parent.parent.snapshot.params.unidadeId).length !== +this.activatedRoute.parent.snapshot.params.ordem) {

        // Incrementa a ordem, e vai para proxima avaliação
        this.router.navigate(['avaliar/' + this.publicService.dispositivo.numeroLicenca + '/' + (+this.activatedRoute.parent.parent.snapshot.params.unidadeId) + '/ordem/' + (Number(this.activatedRoute.parent.snapshot.params.ordem) + 1)]);

        // Se a quantidade de unidades tipos avaliações for igual a ordem, então....
      } else {

        // Se o sistema foi configurado para exigir feedback
        if (this.publicService.configuracao.feedback) {

          // Vai para feedback
          this.router.navigate(['avaliar/' + this.publicService.dispositivo.numeroLicenca + '/' + (+this.activatedRoute.parent.parent.snapshot.params.unidadeId) + '/feedback']);
        } else {

          // Senão, conclui e agradece
          this.router.navigate(['avaliar/' + this.publicService.dispositivo.numeroLicenca + '/' + (+this.activatedRoute.parent.parent.snapshot.params.unidadeId) + '/conclusao/robot-verify'])
        }
      }

    } else {
      this.snackBar.open('Selecione ao menos um atendente', 'Fechar', SelecionarAtendentesComponent.matSnackBarConfig)
    }
  }

  /**
   *
   */
  ngOnDestroy(): void {
    // Resolva o loading.
    this.publicService.resolve('overlayStarSyntax')
  }
}
