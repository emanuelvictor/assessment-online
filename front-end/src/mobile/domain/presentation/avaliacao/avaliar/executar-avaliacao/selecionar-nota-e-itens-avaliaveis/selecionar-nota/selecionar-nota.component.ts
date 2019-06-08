import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MobileService} from "../../../../../../service/mobile.service";
import {AuthenticationService} from "../../../../../../../../web/domain/service/authentication.service";
import {MatIconRegistry, MatSnackBar} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {UnidadeTipoAvaliacao} from "../../../../../../../../web/domain/entity/avaliacao/unidade-tipo-avaliacao.model";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../../../../web/domain/repository/unidade-tipo-avaliacao.repository";
import {AvaliavelRepository} from "../../../../../../../../web/domain/repository/avaliavel.repository";
import {TdLoadingService} from "@covalent/core";
import {AbstractComponent} from "../../abstract/abstract.component";
import {Avaliacao} from "../../../../../../../../web/domain/entity/avaliacao/avaliacao.model";

@Component({
  selector: 'selecionar-nota',
  templateUrl: './selecionar-nota.component.html',
  styleUrls: ['./selecionar-nota.component.scss']
})
export class SelecionarNotaComponent extends AbstractComponent implements OnInit {

  /**
   *
   * @type {UnidadeTipoAvaliacao}
   */
  unidadeTipoAvaliacao: UnidadeTipoAvaliacao = null;

  /**
   *
   */
  unidadesTiposAvaliacoes: any;

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
   * @param _loadingService
   * @param {AvaliavelRepository} avaliavelRepository
   * @param {AuthenticationService} authenticationService
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   */
  constructor(public _loadingService: TdLoadingService,
              private avaliavelRepository: AvaliavelRepository,
              private authenticationService: AuthenticationService,
              public activatedRoute: ActivatedRoute, private router: Router,
              public mobileService: MobileService, public snackBar: MatSnackBar,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    super(snackBar, mobileService, _loadingService)
  }

  /**
   *
   */
  ngOnInit() {

    // Requisita unidades.
    this.mobileService.requestUnidades().then(unidades => {

      // Se não tem unidades selecionadas vai para tela de selação de unidades
      if (!unidades || !unidades.length) {
        this.router.navigate(['configurar-unidades-e-avaliacoes']);
        this._loadingService.resolve('overlayStarSyntax');
        return
      }

      // Requisita unidadesTiposAvaliacoes.
      this.mobileService.requestUnidadesTiposAvaliacoes().then(unidadesTiposAvaliacoes => {

        // Popula variável de unidadesTiposAvalicoes, esta variável será utilizada na conclusão da avaliação.
        this.unidadesTiposAvaliacoes = unidadesTiposAvaliacoes;

        // Se não tem unidades selecionadas vai para tela de selação de unidades
        if (!unidadesTiposAvaliacoes || !unidadesTiposAvaliacoes.length) {
          this.router.navigate(['configurar-unidades-e-avaliacoes']);
          this._loadingService.resolve('overlayStarSyntax');
          return
        }

        // Se não tem unidadeId, então retorna para seleção de unidade.
        if (!this.activatedRoute.parent.snapshot.params.ordem) {
          this.router.navigate(['configurar-unidades-e-avaliacoes']);
          this._loadingService.resolve('overlayStarSyntax');
          return
        }

        // Conta a quantidade de avaliações, utilizado para criar contador na tela.
        this.countTiposAvaliacoes = this.unidadesTiposAvaliacoes.filter(unidadeTipoAvaliacao => unidadeTipoAvaliacao.unidade.id === +this.activatedRoute.parent.parent.snapshot.params.unidadeId).length;

        // Se só tem uma unidade selecionada, e a ordem da avaliação é 1, então reseta o timeout.
        // Pois não há necessidade de zerá-lo, uma vez que não há mais de uma unidade para ser selecionada.
        // Isso auxilia na experiência de usuário, a tela não fica piscando
        if (unidades.length === 1 && +this.activatedRoute.parent.snapshot.params.ordem === 1) {
          this.mobileService.clearTimeout()
        }

        // Se não está configurada a ordem, então volta para a tela inicial de configuração/seleção de unidades e tipos de avaliações vinculadas a essas.
        if (!this.activatedRoute.parent.parent.snapshot.params.unidadeId) {
          this.router.navigate(['avaliar']);
          this._loadingService.resolve('overlayStarSyntax');
          return
        }

        // Pega a unidade filtrada pela ordem e pela unidade
        this.unidadeTipoAvaliacao = this.unidadesTiposAvaliacoes.filter(unidadeTipoAvaliacao => {
          return unidadeTipoAvaliacao.unidade.id === +this.activatedRoute.parent.parent.snapshot.params.unidadeId && unidadeTipoAvaliacao.ordem === this.activatedRoute.parent.snapshot.params.ordem
        })[0];

        // Resolve o loading.
        this._loadingService.resolve('overlayStarSyntax')
      })
    });

    this.iconRegistry.addSvgIconInNamespace('assets', 'pessimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/pessimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'regular', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/regular.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'bom', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/bom.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'otimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/otimo.svg'))

  }

  /**
   *
   */
  public proximo(nota: number) {

    const avaliacao: Avaliacao = new Avaliacao();
    avaliacao.nota = nota;

    this.mobileService.agrupador.avaliacoes.push(avaliacao);

    this.router.navigate(['avaliar/' + (+this.activatedRoute.parent.parent.snapshot.params.unidadeId) + '/ordem/' + this.activatedRoute.parent.snapshot.params.ordem + '/selecionar-atendentes']);

  }

}
