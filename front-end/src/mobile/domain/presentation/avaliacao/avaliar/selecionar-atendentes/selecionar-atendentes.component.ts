import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {MobileService} from "../../../../service/mobile.service";
import {AvaliavelRepository} from "../../../../../../web/domain/repositories/avaliavel.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../../web/domain/repositories/unidade-tipo-avaliacao.repository";
import {TdLoadingService} from "@covalent/core";
import {ConfiguracaoRepository} from "../../../../../../web/domain/repositories/configuracao.repository";
import {Configuracao} from "../../../../../../web/domain/entity/configuracao/configuracao.model";

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
  unidadeTipoAvaliacao: any;

  /**
   *
   */
  configuracao: Configuracao;

  /**
   *
   */
  timeout: any;

  /**
   *
   */
  time = 30000;

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
  constructor(private router: Router,
              private snackBar: MatSnackBar,
              public mobileService: MobileService,
              public activatedRoute: ActivatedRoute,
              private _loadingService: TdLoadingService,
              private avaliavelRepository: AvaliavelRepository,
              private configuracaoRepository: ConfiguracaoRepository,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    this._loadingService.register('overlayStarSyntax');
    if (this.mobileService.unidadesTiposAvaliacoes && this.mobileService.unidadesTiposAvaliacoes.length) {

      const local = this.mobileService.getUnidadeTipoAvaliacaoByIndex(this.activatedRoute.snapshot.params['ordem']);

      if (!local) {
        this.router.navigate(['selecionar-avaliacao']);
      }

      this.unidadeTipoAvaliacaoRepository.findById(local.id)
        .subscribe(result => this.unidadeTipoAvaliacao = result)

    }

    this.timeout = setTimeout(() => {
      this.mobileService.reset();
      this.router.navigate(['/avaliar/1']);
      this._loadingService.resolve('overlayStarSyntax');
    }, this.time);

    this.configuracaoRepository.requestConfiguracao.subscribe(configuracao => {
      this.configuracao = configuracao;
      this.avaliavelRepository.listByFilters(
        {
          ativo: true,
          unidadeTipoAvaliacaoId: this.mobileService.unidadesTiposAvaliacoes.filter(unidadeTipoAvaliacao => unidadeTipoAvaliacao.ordem === this.activatedRoute.snapshot.params['ordem'])[0].id
        }
      )
        .subscribe(page => {

          this.avaliaveis = page.content;
          this._loadingService.resolve('overlayStarSyntax');

          if (this.avaliaveis.length === 1) {
            this.avaliaveis[0].selected = true;
            this.concluir();
          } else if (!this.avaliaveis.length) {
            this.openSnackBar('Vincule os itens avaliáveis à uma unidade');
            this.router.navigate(['conclusao'])
          }
        })
    })
  }

  /**
   *
   */
  public concluir() {
    clearTimeout(this.timeout);

    this.avaliaveis.forEach(avaliavel => {
      if (avaliavel.selected) {
        this.mobileService.addAvaliavel(avaliavel);
      }
    });

    /**
     * TODO aumentar o timeout da toast
     */
    if (this.mobileService.getAvaliaveis().length > 0) {
      this.mobileService.enviarAvaliacao();

      if (this.mobileService.unidadesTiposAvaliacoes.length !== +this.activatedRoute.snapshot.params['ordem']) {
        this.router.navigate(['avaliar/' + (+this.activatedRoute.snapshot.params['ordem'] + 1)]);
      } else {
        if (this.configuracao.feedback) {
          this.router.navigate(['feedback']);
        } else {
          this.router.navigate(['conclusao']);
        }
      }
    } else {
      this.snackBar.open('Selecione ao menos um atendente', 'Fechar', this.mobileService.getSnackBarConfig());
    }
  }

  /**
   *
   */
  public clearTimeout() {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => this.mobileService.reset(), this.time);
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
