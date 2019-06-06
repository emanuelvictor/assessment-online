import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {MobileService} from "../../../../../service/mobile.service";
import {AvaliavelRepository} from "../../../../../../../web/domain/repositories/avaliavel.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../../../web/domain/repositories/unidade-tipo-avaliacao.repository";
import {TdLoadingService} from "@covalent/core";
import {ConfiguracaoRepository} from "../../../../../../../web/domain/repositories/configuracao.repository";
import {AbstractComponent} from "../../../abstract/abstract.component";

@Component({
  selector: 'selecionar-atendentes',
  templateUrl: './selecionar-atendentes.component.html',
  styleUrls: ['./selecionar-atendentes.component.scss']
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
  unidadesTiposAvaliacoes: any;

  /**
   *
   */
  unidadeTipoAvaliacao: any;

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MobileService} mobileService
   * @param {ActivatedRoute} activatedRoute
   * @param {TdLoadingService} _loadingService
   * @param {AvaliavelRepository} avaliavelRepository
   * @param configuracaoRepository
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   */
  constructor(public _loadingService: TdLoadingService,
              private avaliavelRepository: AvaliavelRepository,
              public configuracaoRepository: ConfiguracaoRepository,
              public mobileService: MobileService, private router: Router,
              public activatedRoute: ActivatedRoute, public snackBar: MatSnackBar,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {
    super(snackBar, mobileService, _loadingService, configuracaoRepository)
  }

  /**
   *
   */
  ngOnInit() {

    // Requisita unidades.
    this.mobileService.requestUnidades().then(unidades => {

      // Requisita unidadesTiposAvaliacoes.
      this.mobileService.requestUnidadesTiposAvaliacoes().then(unidadesTiposAvaliacoes => {

        // Popula variável de unidadesTiposAvalicoes, esta variável será utilizada na conclusão da avaliação.
        this.unidadesTiposAvaliacoes = unidadesTiposAvaliacoes;

        // Se não tem unidades selecionadas vai para tela de selação de unidades
        if (!unidades || !unidades.length || !unidadesTiposAvaliacoes || !unidadesTiposAvaliacoes.length) {
          this.router.navigate(['configurar-unidades-e-avaliacoes']);
          this._loadingService.resolve('overlayStarSyntax');
          return
        }

        // Se não tem unidadeId, então retorna para seleção de unidade.
        if (!this.activatedRoute.snapshot.params.ordem) {
          this.router.navigate(['configurar-unidades-e-avaliacoes']);
          this._loadingService.resolve('overlayStarSyntax');
          return
        }

        // Se não está configurada a ordem, então volta para a tela inicial de configuração/seleção de unidades e tipos de avaliações vinculadas a essas.
        if (!this.activatedRoute.parent.snapshot.params['unidadeId']) {
          this.router.navigate(['selecionar-unidade']);
          this._loadingService.resolve('overlayStarSyntax');
          return
        }

        // Pega a unidade filtrada pela ordem e pela unidade
        this.unidadeTipoAvaliacao = this.unidadesTiposAvaliacoes.filter(unidadeTipoAvaliacao => {
          return unidadeTipoAvaliacao.unidade.id === +this.activatedRoute.parent.snapshot.params.unidadeId && unidadeTipoAvaliacao.ordem === this.activatedRoute.snapshot.params.ordem
        })[0];

        // Requisita os avaliáveis de acordo com o tipo de avaliação.
        this.avaliavelRepository.listByFilters({ativo: true, unidadeTipoAvaliacaoId: this.unidadeTipoAvaliacao.id}).subscribe(resultt => {
          this.avaliaveis = resultt.content;

          // Se tem apenas um avaliável
          if (this.avaliaveis.length === 1) {

            // Seleciona o mesmo
            this.avaliaveis[0].selected = true;

            // Conclui a avaliação
            this.concluir();

            // Se não tem avaliáveis, esta errado, pois deve ter avaliáveis.
          } else if (!this.avaliaveis.length) {

            // Então vai para a tela de erro para instruir o usuário
            this.router.navigate(['offline'])
          }

          // Resolve loading.
          this._loadingService.resolve('overlayStarSyntax');
        })
      })
    })
  }

  /**
   *
   */
  public concluir() {

    // Restarta o timeout
    this.restartTimeout();

    // Adiciona os avaliáveis selecionados
    this.mobileService.avaliaveis = this.avaliaveis.filter(avaliavel => avaliavel.selected);

    // Se nenhum avaliável foi selecionado, exibe mensagem para seleção.
    if (this.mobileService.avaliaveis.length > 0) {

      // // Envia a avaliação
      this.mobileService.enviarAvaliacao();

      // Se a quantidade de unidades tipos avaliações for diferente que a ordem, então as avaliações não chegaram no fim.
      if (this.unidadesTiposAvaliacoes.filter(unidadeTipoAvaliacao => unidadeTipoAvaliacao.unidade.id === +this.activatedRoute.parent.snapshot.params.unidadeId).length !== +this.activatedRoute.snapshot.params.ordem) {

        // Incrementa a ordem, e vai para proxima avaliação
        this.router.navigate(['/avaliar/' + (+this.activatedRoute.parent.snapshot.params.unidadeId) + '/' + (Number(this.activatedRoute.snapshot.params.ordem) + 1)]);

        // Se a quantidade de unidades tipos avaliações for igual a ordem, então....
      } else {

        // Se o sistema foi configurado para exigir feedback
        if (this.configuracao.feedback) {

          // Vai para feedback
          this.router.navigate(['/avaliar/' + (+this.activatedRoute.parent.snapshot.params.unidadeId) + '/' + this.activatedRoute.snapshot.params.ordem + '/feedback']);
        } else {

          // Senão, conclui e agradece
          this.router.navigate(['/avaliar/' + (+this.activatedRoute.parent.snapshot.params.unidadeId) + '/' + this.activatedRoute.snapshot.params.ordem + '/conclusao'])
        }
      }

    } else {
      this.snackBar.open('Selecione ao menos um atendente', 'Fechar', this.mobileService.getSnackBarConfig())
    }
  }
}
