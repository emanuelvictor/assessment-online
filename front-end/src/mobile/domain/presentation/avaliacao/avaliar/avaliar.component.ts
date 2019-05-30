import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MobileService} from '../../../service/mobile.service';
import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry} from "@angular/material";
import {AuthenticationService} from "../../../../../web/domain/service/authentication.service";
import {Configuracao} from "../../../../../web/domain/entity/configuracao/configuracao.model";
import {ConfiguracaoService} from "../../../../../web/domain/service/configuracao.service";
import {Agrupador} from "../../../../../web/domain/entity/avaliacao/agrupador.model";

@Component({
  selector: 'avaliar',
  templateUrl: './avaliar.component.html',
  styleUrls: ['./avaliar.component.scss']
})
export class AvaliarComponent implements OnInit {

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

    /**
     * Se não tem unidade selecionada vai para tela de selação de unidade
     */
    if (!this.mobileService.unidades || this.mobileService.unidades.length) {
      this.mobileService.removeUnidades();
      this.mobileService.reset();
      this.mobileService.agrupador = new Agrupador();
      this.router.navigate(['selecionar-unidade']);
      return;
    }

    this.iconRegistry.addSvgIconInNamespace('assets', 'pessimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/pessimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'regular', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/regular.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'bom', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/bom.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'otimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/otimo.svg'));

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
    this.mobileService.removeUnidades();
    this.authenticationService.logout();
    this.router.navigate(['/authentication']);
  }
}
