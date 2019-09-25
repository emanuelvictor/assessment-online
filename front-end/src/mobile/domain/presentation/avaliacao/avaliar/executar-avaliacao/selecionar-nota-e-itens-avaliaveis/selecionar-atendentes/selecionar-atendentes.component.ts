import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {MobileService} from "../../../../../../service/mobile.service";
import {AvaliavelRepository} from "../../../../../../../../web/domain/repository/avaliavel.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../../../../web/domain/repository/unidade-tipo-avaliacao.repository";
import {TdLoadingService} from "@covalent/core";
import {AbstractComponent} from "../../abstract/abstract.component";
import {AvaliacaoAvaliavel} from "../../../../../../../../web/domain/entity/avaliacao/avaliacao-avaliavel.model";
import {viewAnimation} from "../../../../../../../../web/domain/presentation/controls/utils";

@Component({
  selector: 'selecionar-atendentes',
  templateUrl: './selecionar-atendentes.component.html',
  styleUrls: ['./selecionar-atendentes.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class SelecionarAtendentesComponent extends AbstractComponent implements OnInit {

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
   * @param {MobileService} mobileService
   * @param {ActivatedRoute} activatedRoute
   * @param {TdLoadingService} _loadingService
   * @param {AvaliavelRepository} avaliavelRepository
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   */
  constructor(public _loadingService: TdLoadingService,
              private avaliavelRepository: AvaliavelRepository,
              public mobileService: MobileService, private router: Router,
              public activatedRoute: ActivatedRoute, public snackBar: MatSnackBar,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {
    super(snackBar, mobileService, _loadingService)
  }

  /**
   *
   */
  ngOnInit() {

    // Se não tem avaliações, ou seja, deu F5, então vai pra tela inicial.
    if (!this.mobileService.agrupador.avaliacoes || !this.mobileService.agrupador.avaliacoes.length || this.mobileService.agrupador.avaliacoes.length !== +this.activatedRoute.parent.snapshot.params.ordem) {
      this.router.navigate(['avaliar/' + this.mobileService.dispositivo.numeroLicenca]);
    }

    // Se não tem unidades selecionadas vai para tela de selação de unidades
    if (!this.mobileService.unidades || !this.mobileService.unidades.length) {
      this.router.navigate(['configurar-unidades-e-avaliacoes']);
      this._loadingService.resolve('overlayStarSyntax');
      return
    }

    // Popula variável de unidadesTiposAvalicoes, esta variável será utilizada na conclusão da avaliação.
    this.unidadesTiposAvaliacoesDispositivo = this.mobileService.unidadesTiposAvaliacoesDispositivo;

    // Se não tem unidades selecionadas vai para tela de selação de unidades
    if (!this.mobileService.unidadesTiposAvaliacoesDispositivo || !this.mobileService.unidadesTiposAvaliacoesDispositivo.length) {
      this.router.navigate(['configurar-unidades-e-avaliacoes']);
      this._loadingService.resolve('overlayStarSyntax');
      return
    }

    // Conta a quantidade de avaliações, utilizado para criar contador na tela.
    this.countTiposAvaliacoes = this.unidadesTiposAvaliacoesDispositivo.filter(unidadeTipoAvaliacaoDispositivo => unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.id === +this.activatedRoute.parent.parent.snapshot.params.unidadeId).length;

    // Se não tem unidadeId, então retorna para seleção de unidade. //TODO pode estar no abstract
    if (!this.activatedRoute.parent.snapshot.params.ordem) {
      this.router.navigate(['configurar-unidades-e-avaliacoes']);
      this._loadingService.resolve('overlayStarSyntax');
      return
    }

    // Se não está configurada a ordem, então volta para a tela inicial de configuração/seleção de unidades e tipos de avaliações vinculadas a essas. //TODO pode estar no abstract
    if (!this.activatedRoute.parent.parent.snapshot.params.unidadeId) {
      this.router.navigate(['avaliar/' + this.mobileService.dispositivo.numeroLicenca]);
      this._loadingService.resolve('overlayStarSyntax');
      return
    }

    // Pega a unidade filtrada pela ordem e pela unidade
    this.unidadeTipoAvaliacaoDispositivo = this.unidadesTiposAvaliacoesDispositivo.filter(unidadeTipoAvaliacaoDispositivo => {
      return unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.id === +this.activatedRoute.parent.parent.snapshot.params.unidadeId && unidadeTipoAvaliacaoDispositivo.ordem === +this.activatedRoute.parent.snapshot.params.ordem
    })[0];

    // Requisita os avaliáveis de acordo com o tipo de avaliação vinculado ao dispositivo.
    this.avaliavelRepository.listByFilters({

      ativo: true,

      unidadeTipoAvaliacaoDispositivoId: this.unidadeTipoAvaliacaoDispositivo.id //TODO implementar requisição com unidadeTipoAvaliacaoDispositivoId no back-end

    }).subscribe(resultt => {

      this.avaliaveis = resultt.content;

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
      this._loadingService.resolve('overlayStarSyntax');
    })
  }

  /**
   *
   */
  public proximo() {

    // Restarta o timeout
    this.restartTimeout();

    // Adiciona avaliação TODO
    this.mobileService.agrupador.avaliacoes[+this.activatedRoute.parent.snapshot.params.ordem - 1].avaliacoesAvaliaveis = this.avaliaveis.filter(avaliavel => avaliavel.selected).map(value => new AvaliacaoAvaliavel(value, this.mobileService.agrupador.avaliacoes[+this.activatedRoute.parent.snapshot.params.ordem - 1]));

    // Se nenhum avaliável foi selecionado, exibe mensagem para seleção.
    if (this.mobileService.agrupador.avaliacoes[+this.activatedRoute.parent.snapshot.params.ordem - 1].avaliacoesAvaliaveis.length > 0) {

      // Se a quantidade de unidades tipos avaliações for diferente que a ordem, então as avaliações não chegaram no fim.
      if (this.unidadesTiposAvaliacoesDispositivo.filter(unidadeTipoAvaliacaoDispositivo => unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.id === +this.activatedRoute.parent.parent.snapshot.params.unidadeId).length !== +this.activatedRoute.parent.snapshot.params.ordem) {

        // Incrementa a ordem, e vai para proxima avaliação
        this.router.navigate(['avaliar/' + this.mobileService.dispositivo.numeroLicenca + '/' + (+this.activatedRoute.parent.parent.snapshot.params.unidadeId) + '/ordem/' + (Number(this.activatedRoute.parent.snapshot.params.ordem) + 1)]);

        // Se a quantidade de unidades tipos avaliações for igual a ordem, então....
      } else {

        // Se o sistema foi configurado para exigir feedback
        if (this.configuracao.feedback) {

          // Vai para feedback
          this.router.navigate(['avaliar/' + this.mobileService.dispositivo.numeroLicenca + '/' + (+this.activatedRoute.parent.parent.snapshot.params.unidadeId) + '/feedback']);
        } else {

          // Senão, conclui e agradece
          this.router.navigate(['avaliar/' + this.mobileService.dispositivo.numeroLicenca + '/' + (+this.activatedRoute.parent.parent.snapshot.params.unidadeId) + '/conclusao'])
        }
      }

    } else {
      this.snackBar.open('Selecione ao menos um atendente', 'Fechar', SelecionarAtendentesComponent.matSnackBarConfig)
    }
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
}
