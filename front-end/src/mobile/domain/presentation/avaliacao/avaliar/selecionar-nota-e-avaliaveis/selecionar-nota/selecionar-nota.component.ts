import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Configuracao} from "../../../../../../../web/domain/entity/configuracao/configuracao.model";
import {MobileService} from "../../../../../service/mobile.service";
import {ConfiguracaoService} from "../../../../../../../web/domain/service/configuracao.service";
import {AuthenticationService} from "../../../../../../../web/domain/service/authentication.service";
import {MatIconRegistry, MatSnackBar} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {UnidadeTipoAvaliacao} from "../../../../../../../web/domain/entity/avaliacao/unidade-tipo-avaliacao.model";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../../../web/domain/repositories/unidade-tipo-avaliacao.repository";
import {AvaliavelRepository} from "../../../../../../../web/domain/repositories/avaliavel.repository";
import {TdLoadingService} from "@covalent/core";
import {ConfiguracaoRepository} from "../../../../../../../web/domain/repositories/configuracao.repository";

@Component({
  selector: 'selecionar-nota',
  templateUrl: './selecionar-nota.component.html',
  styleUrls: ['./selecionar-nota.component.scss']
})
export class SelecionarNotaComponent implements OnInit {

  /**
   *
   * @type {Configuracao}
   */
  configuracao: Configuracao;

  /**
   *
   * @type {UnidadeTipoAvaliacao}
   */
  unidadeTipoAvaliacao: UnidadeTipoAvaliacao = null;

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MobileService} mobileService
   * @param {ActivatedRoute} activatedRoute
   * @param _loadingService
   * @param {ConfiguracaoRepository} configuracaoRepository
   * @param {AvaliavelRepository} avaliavelRepository
   * @param {AuthenticationService} authenticationService
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   */
  constructor(public activatedRoute: ActivatedRoute,
              private avaliavelRepository: AvaliavelRepository,
              private authenticationService: AuthenticationService,
              private configuracaoRepository: ConfiguracaoRepository,
              private _loadingService: TdLoadingService, private router: Router,
              public mobileService: MobileService, private snackBar: MatSnackBar,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
  }

  /**
   *
   */
  ngOnInit() {

    // Registra o loading
    this._loadingService.register('overlayStarSyntax');

    // Requisita configuração.
    this.configuracaoRepository.requestConfiguracao.subscribe(result => {
      this.configuracao = result;

      // Requisita unidades.
      this.mobileService.unidades.subscribe(unidades => {

        // Requisita unidadesTiposAvaliacoes.
        this.mobileService.unidadesTiposAvaliacoes.subscribe(unidadesTiposAvaliacoes => {

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
              console.log('vaii');
              this.unidadeTipoAvaliacao = unidadeTipoAvaliacao;

              this.iconRegistry.addSvgIconInNamespace('assets', 'pessimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/pessimo.svg'));
              this.iconRegistry.addSvgIconInNamespace('assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/ruim.svg'));
              this.iconRegistry.addSvgIconInNamespace('assets', 'regular', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/regular.svg'));
              this.iconRegistry.addSvgIconInNamespace('assets', 'bom', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/bom.svg'));
              this.iconRegistry.addSvgIconInNamespace('assets', 'otimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/otimo.svg'));

              this._loadingService.resolve('overlayStarSyntax')
            })

        })

      })

    });

  }

  /**
   *
   */
  public avaliar(nota: number) {

    this._loadingService.register('overlayStarSyntax');

    this.mobileService.setNota(nota);

    this.router.navigate(['avaliar/' + (+this.activatedRoute.snapshot.params['unidadeId']) + '/selecionar-atendentes'], {queryParams: {ordem: (this.activatedRoute.queryParams as any).value.ordem}});

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
