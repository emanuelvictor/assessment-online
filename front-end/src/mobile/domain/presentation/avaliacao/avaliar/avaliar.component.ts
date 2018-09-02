import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MobileService} from '../../../service/mobile.service';
import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry} from "@angular/material";
import {AuthenticationService} from "../../../../../web/domain/service/authentication.service";

@Component({
  selector: 'avaliar',
  templateUrl: './avaliar.component.html',
  styleUrls: ['./avaliar.component.scss']
})
export class AvaliarComponent implements OnInit {

  /**
   *
   * @param {Router} router
   * @param {MobileService} mobileService
   * @param {AuthenticationService} authenticationService
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   */
  constructor(private router: Router, private mobileService: MobileService, public authenticationService: AuthenticationService, private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.iconRegistry.addSvgIconInNamespace('assets', 'pessimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/pessimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'regular', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/regular.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'bom', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/bom.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'otimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/otimo.svg'));
  }

  /**
   *
   */
  ngOnInit() {
    /**
     * Se não tem unidade selecionada vai para tela de selação de unidade
     */
    if (!this.mobileService.getUnidade())
      this.router.navigate(['selecionar-unidade']);
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