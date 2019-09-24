import {Component, ElementRef, Inject, OnInit, Renderer} from "@angular/core";
import {MatSnackBar} from "@angular/material";
import {MobileService} from "../../../../../service/mobile.service";
import {Router} from "@angular/router";
import {Agrupador} from "../../../../../../../web/domain/entity/avaliacao/agrupador.model";
import {FormBuilder} from "@angular/forms";
import {TdLoadingService} from "@covalent/core";
import {Subject} from "rxjs";
import {viewAnimation} from "../../../../../../../web/domain/presentation/controls/utils";

@Component({
  selector: 'authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class AuthenticateComponent implements OnInit {

  /**
   *
   */
  password: string;

  /**
   *
   * @type {Subject<string>}
   */
  public modelChanged: Subject<any> = new Subject<any>();

  /**
   *
   * @param fb
   * @param {MobileService} mobileService
   * @param _loadingService
   * @param element
   * @param renderer
   * @param snackBar
   * @param {Router} router
   */
  constructor(private mobileService: MobileService,
              private _loadingService: TdLoadingService,
              @Inject(ElementRef) private element: ElementRef,
              private router: Router, private renderer: Renderer,
              private snackBar: MatSnackBar, private fb: FormBuilder) {
  }

  /**
   *
   */
  ngOnInit(): void {
    // Registra o loading.
    this._loadingService.register('overlayStarSyntax');

    // Se não tem unidades selecionadas
    if (!this.mobileService.unidades || !this.mobileService.unidades.length) {
      this.router.navigate(['/configuracoes/opcoes-de-configuracao']);
      this._loadingService.resolve('overlayStarSyntax');
      return
    }

    // Se não tem unidadesTiposAvaliacoes selecionadas
    if (!this.mobileService.unidadesTiposAvaliacoesDispositivo || !this.mobileService.unidadesTiposAvaliacoesDispositivo.length) {
      this._loadingService.resolve('overlayStarSyntax');
      this.router.navigate(['/configuracoes/opcoes-de-configuracao']);
      return
    }

    // Requisita configuração
    this.mobileService.requestConfiguracao.then(() => {
      this._loadingService.resolve('overlayStarSyntax');
      this.mobileService.restartTimeout()
    });


    // Debounce da digitação, toda vez que o usuário digita alguma coisa, depois de 300 milisegundos ele executa isso.
    this.modelChanged.debounceTime(300).subscribe(model => {

      // Restarta o timeout
      this.mobileService.restartTimeout();

      if (model && model.length)
        if (model.length === 6)
          this.mobileService.logout(model).then(() => {
            this.mobileService.agrupador = new Agrupador();
            this.router.navigate(['/configuracoes/opcoes-de-configuracao'])
          }).catch(error => {
            this.error(error)
          })

    })
  }

  /**
   *
   */
  cancelar() {
    this.mobileService.agrupador = new Agrupador();
    this.router.navigate([this.mobileService.dispositivo.numeroLicenca])
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
