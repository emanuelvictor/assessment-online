import {Component, ElementRef, Inject, OnInit, Renderer} from "@angular/core";
import {MatSnackBar} from "@angular/material";
import {MobileService} from "../../../../../service/mobile.service";
import {AuthenticationService} from "../../../../../../../web/domain/service/authentication.service";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {viewAnimation} from "../../../../../../../web/domain/presentation/controls/utils";

@Component({
  selector: 'opcoes-de-configuracao',
  templateUrl: './opcoes-de-configuracao.component.html',
  styleUrls: ['./opcoes-de-configuracao.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class OpcoesDeConfiguracaoComponent implements OnInit {

  /**
   *
   */
  public done = false;

  /**
   *
   * @param fb
   * @param {MobileService} mobileService
   * @param element
   * @param renderer
   * @param snackBar
   * @param {Router} router
   */
  constructor(private mobileService: MobileService,
              @Inject(ElementRef) private element: ElementRef,
              private router: Router, private renderer: Renderer,
              private snackBar: MatSnackBar, private fb: FormBuilder) {
  }

  /**
   *
   */
  ngOnInit(): void {
    // Requisita configuração
    this.mobileService.requestConfiguracao.then(() => {
      this.done = true;
      this.mobileService.restartTimeout()
    })
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
    this.mobileService.dispositivo = null;

    // Vai pra reconfigurar
    this.router.navigate(['/configurar-unidades-e-avaliacoes'])

  }

  /**
   *
   */
  logout() {

    // Limpa
    this.mobileService.dispositivo = null;

    // Vai pra reconfigurar
    this.mobileService.logout().then(() => this.router.navigate(['/configurar-unidades-e-avaliacoes']))

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
