import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Configuracao} from "../../../../../../web/domain/entity/configuracao/configuracao.model";
import {MobileService} from "../../../../service/mobile.service";
import {ConfiguracaoService} from "../../../../../../web/domain/service/configuracao.service";
import {AuthenticationService} from "../../../../../../web/domain/service/authentication.service";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {UnidadeTipoAvaliacao} from "../../../../../../web/domain/entity/avaliacao/unidade-tipo-avaliacao.model";

@Component({
  selector: 'visualizar-avaliacao',
  templateUrl: './visualizar-avaliacao.component.html',
  styleUrls: ['./visualizar-avaliacao.component.scss']
})
export class VisualizarAvaliacaoComponent implements OnInit {

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
   * @param {MobileService} mobileService
   * @param {ActivatedRoute} activatedRoute
   * @param {ConfiguracaoService} configuracaoService
   * @param {AuthenticationService} authenticationService
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   */
  constructor(private router: Router,
              public mobileService: MobileService,
              public activatedRoute: ActivatedRoute,
              private configuracaoService: ConfiguracaoService,
              private authenticationService: AuthenticationService,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
  }

  /**
   *
   */
  ngOnInit() {

    if (this.mobileService.unidadesTiposAvaliacoes && this.mobileService.unidadesTiposAvaliacoes.length)
      this.unidadeTipoAvaliacao = this.mobileService.getUnidadeTipoAvaliacaoByIndex(this.activatedRoute.snapshot.params['ordem']);

    if(!this.unidadeTipoAvaliacao)
      this.router.navigate(['selecionar-avaliacao']);

    this.iconRegistry.addSvgIconInNamespace('assets', 'pessimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/pessimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'regular', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/regular.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'bom', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/bom.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'otimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/otimo.svg'));

    /**
     * Se não tem unidade selecionada vai para tela de selação de unidade
     */
    if (!this.mobileService.getUnidadeId())
      this.router.navigate(['../selecionar-unidade']);

    this.configuracaoService.configuracao.subscribe(result => this.configuracao = result)
  }

  /**
   *
   */
  public avaliar(nota: number) {
    this.mobileService.setNota(nota);
    this.router.navigate(['avaliar/' + (+this.activatedRoute.snapshot.params['ordem']) + '/selecionar-atendentes']);
  }

  /**
   *
   */
  public logout(): void {
    this.mobileService.removeUnidade();
    this.authenticationService.logout();
    this.router.navigate(['/authentication']);
  }
}
