import {Component, ElementRef, Inject, Renderer} from "@angular/core";
import {MatSnackBar} from "@angular/material";
import {MobileService} from "../../../../../service/mobile.service";
import {AuthenticationService} from "../../../../../../../web/domain/service/authentication.service";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'opcoes-de-configuracao',
  templateUrl: './opcoes-de-configuracao.component.html',
  styleUrls: ['./opcoes-de-configuracao.component.scss']
})
export class OpcoesDeConfiguracaoComponent {

  /**
   *
   * @param fb
   * @param {MobileService} mobileService
   * @param element
   * @param renderer
   * @param snackBar
   * @param {AuthenticationService} authenticationService
   * @param {Router} router
   */
  constructor(private mobileService: MobileService,
              @Inject(ElementRef) private element: ElementRef,
              private router: Router, private renderer: Renderer,
              private authenticationService: AuthenticationService,
              private snackBar: MatSnackBar, private fb: FormBuilder) {
  }

  /**
   *
   */
  cancelar() {

    this.router.navigate(['/avaliar'])

  }

  /**
   *
   */
  reconfig() {

    // Limpa
    this.mobileService.localStorage.removeUnidades();
    this.mobileService.localStorage.removeUnidadesTiposAvaliacoes();

    // Vai pra reconfigurar
    this.router.navigate(['/configurar-unidades-e-avaliacoes'])

  }

  logout() {

    // Limpa
    this.mobileService.localStorage.removeHashs();
    this.mobileService.localStorage.removeUnidades();
    this.mobileService.localStorage.removeUnidadesTiposAvaliacoes();

    // Vai pra reconfigurar
    this.authenticationService.logout().then(() => this.router.navigate(['/configurar-unidades-e-avaliacoes']))

  }

  /**
   *
   * @param message
   */
  public error(message: string) {
    this.openSnackBar(message)
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    })
  }

}
