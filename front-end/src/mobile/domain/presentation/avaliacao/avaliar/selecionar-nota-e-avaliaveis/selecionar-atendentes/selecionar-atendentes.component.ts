import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {MobileService} from "../../../../../service/mobile.service";
import {AvaliavelRepository} from "../../../../../../../web/domain/repositories/avaliavel.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../../../web/domain/repositories/unidade-tipo-avaliacao.repository";
import {TdLoadingService} from "@covalent/core";
import {ConfiguracaoRepository} from "../../../../../../../web/domain/repositories/configuracao.repository";
import {Configuracao} from "../../../../../../../web/domain/entity/configuracao/configuracao.model";
import {ConfiguracaoService} from "../../../../../../../web/domain/service/configuracao.service";

@Component({
  selector: 'selecionar-atendentes',
  templateUrl: './selecionar-atendentes.component.html',
  styleUrls: ['./selecionar-atendentes.component.scss']
})
export class SelecionarAtendentesComponent implements OnInit {

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
   */
  configuracao: Configuracao;

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MobileService} mobileService
   * @param {ActivatedRoute} activatedRoute
   * @param {TdLoadingService} _loadingService
   * @param configuracaoService
   * @param {AvaliavelRepository} avaliavelRepository
   * @param configuracaoRepository
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   */
  constructor(private router: Router,
              private snackBar: MatSnackBar,
              public mobileService: MobileService,
              public activatedRoute: ActivatedRoute,
              private _loadingService: TdLoadingService,
              private configuracaoService: ConfiguracaoService,
              private avaliavelRepository: AvaliavelRepository,
              private configuracaoRepository: ConfiguracaoRepository,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    // Registra o loading
    this._loadingService.register('overlayStarSyntax');

    // Requisita configuração.
    this.configuracaoService.configuracao.subscribe(result => {
      this.configuracao = result;

      // Requisita unidades.
      this.mobileService.unidades.subscribe(unidades => {

        // Requisita unidadesTiposAvaliacoes.
        this.mobileService.unidadesTiposAvaliacoes.subscribe(unidadesTiposAvaliacoes => {

          // Popula variável de unidadesTiposAvalicoes, esta variável será utilizada na conclusão da avaliação.
          this.unidadesTiposAvaliacoes = unidadesTiposAvaliacoes;

          // Se não tem unidades selecionadas vai para tela de selação de unidades
          if (!unidades || !unidades.length || !unidadesTiposAvaliacoes || !unidadesTiposAvaliacoes.length) {
            this.router.navigate(['configurar-unidades-e-avaliacoes']);
            this._loadingService.resolve('overlayStarSyntax');
            return;
          }

          // Se não tem unidadeId, então retorna para seleção de unidade.
          if (!(this.activatedRoute.queryParams as any).value || !(this.activatedRoute.queryParams as any).value.ordem) {
            this.router.navigate(['configurar-unidades-e-avaliacoes']);
            this._loadingService.resolve('overlayStarSyntax');
            return;
          }

          // Se não está configurada a ordem, então volta para a tela inicial de configuração/seleção de unidades e tipos de avaliações vinculadas a essas.
          if (!this.activatedRoute.snapshot.params['unidadeId']) {
            this.router.navigate(['selecionar-unidade']);
            this._loadingService.resolve('overlayStarSyntax');
            return;
          }

          // Pega a unidade filtrada pela ordem e pela unidade
          this.mobileService.getUnidadeTipoAvaliacaoByUnidadeAndOrdem(this.activatedRoute.snapshot.params['unidadeId'], (this.activatedRoute.queryParams as any).value.ordem)
            .subscribe(unidadeTipoAvaliacao => {
              this.unidadeTipoAvaliacao = unidadeTipoAvaliacao;

              // Requisita os avaliáveis de acordo com o tipo de avaliação.
              this.avaliavelRepository.listByFilters({ativo: true, unidadeTipoAvaliacaoId: this.unidadeTipoAvaliacao.id})
                .subscribe(page => {

                  this.avaliaveis = page.content;
                  this._loadingService.resolve('overlayStarSyntax');

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
                });
            })
        });
      });
    });
  }

  /**
   *
   */
  public concluir() {

    // Adiciona os avaliáveis selecionados TODO mudar forma de inserir isso no mobile service
    this.mobileService.avaliaveis = this.avaliaveis.filter( avaliavel => avaliavel.selected);

    // Se nenhum avaliável foi selecionado, exibe mensagem para seleção.
    if (this.mobileService.getAvaliaveis().length > 0) {

      // Envia a avaliação
      this.mobileService.enviarAvaliacao();

      // Se a quantidade de unidades tipos avaliações for diferente que a ordem, então as avaliações não chegaram no fim.
      if (this.unidadesTiposAvaliacoes.length !== +(this.activatedRoute.queryParams as any).value.ordem) {

        // Incrementa a ordem, e vai para proxima avaliação
        this.router.navigate(['avaliar/' + (+this.activatedRoute.snapshot.params['unidadeId']) ], {queryParams: {ordem: (this.activatedRoute.queryParams as any).value.ordem + 1}});

      // Se a quantidade de unidades tipos avaliações for igual a ordem, então....
      } else {

        // Se o sistema foi configurado para exigir feedback
        if (this.configuracao.feedback) {

          // Vai para feedback
          this.router.navigate(['feedback']);
        } else {

          // Senão, conclui e agradece
          this.router.navigate(['conclusao']);
        }
      }
    } else {
      this.snackBar.open('Selecione ao menos um atendente', 'Fechar', this.mobileService.getSnackBarConfig());
    }
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }
}
