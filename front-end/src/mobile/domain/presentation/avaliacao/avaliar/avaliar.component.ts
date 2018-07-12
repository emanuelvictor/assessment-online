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
    this.iconRegistry.addSvgIconInNamespace('mobile-assets', 'terrivel', this.domSanitizer.bypassSecurityTrustResourceUrl('mobile-assets/emojis/terrivel.svg'));
    this.iconRegistry.addSvgIconInNamespace('mobile-assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('mobile-assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('mobile-assets', 'meia-boca', this.domSanitizer.bypassSecurityTrustResourceUrl('mobile-assets/emojis/meia-boca.svg'));
    this.iconRegistry.addSvgIconInNamespace('mobile-assets', 'bacana', this.domSanitizer.bypassSecurityTrustResourceUrl('mobile-assets/emojis/bacana.svg'));
    this.iconRegistry.addSvgIconInNamespace('mobile-assets', 'top-da-balada', this.domSanitizer.bypassSecurityTrustResourceUrl('mobile-assets/emojis/top-da-balada.svg'));
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