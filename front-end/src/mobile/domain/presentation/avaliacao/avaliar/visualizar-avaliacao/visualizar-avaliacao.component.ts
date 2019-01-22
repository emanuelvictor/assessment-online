import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Configuracao} from "../../../../../../web/domain/entity/configuracao/configuracao.model";
import {MobileService} from "../../../../service/mobile.service";
import {ConfiguracaoService} from "../../../../../../web/domain/service/configuracao.service";
import {AuthenticationService} from "../../../../../../web/domain/service/authentication.service";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";

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
   * @param {Router} router
   * @param {MobileService} mobileService
   * @param {ConfiguracaoService} configuracaoService
   * @param {AuthenticationService} authenticationService
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   */
  constructor(private router: Router,
              private mobileService: MobileService,
              private configuracaoService: ConfiguracaoService,
              public authenticationService: AuthenticationService,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
  }

  /**
   *
   */
  ngOnInit() {

    this.iconRegistry.addSvgIconInNamespace('assets', 'pessimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/pessimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'regular', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/regular.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'bom', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/bom.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'otimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/otimo.svg'));

    /**
     * Se não tem unidade selecionada vai para tela de selação de unidade
     */
    if (!this.mobileService.getUnidade())
      this.router.navigate(['selecionar-unidade']);

    this.configuracaoService.configuracao.subscribe(result => this.configuracao = result)
  }

  /**
   *
   */
  public avaliar(nota: number) {
    this.mobileService.setNota(nota);
    this.router.navigate(['selecionar-atendentes']);
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