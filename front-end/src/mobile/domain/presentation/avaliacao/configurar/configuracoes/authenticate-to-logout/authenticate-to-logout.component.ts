import {Component, ElementRef, Inject, OnDestroy, OnInit, Renderer} from "@angular/core";
import {MatSnackBar} from "@angular/material";
import {MobileService} from "../../../../../service/mobile.service";
import {Router} from "@angular/router";
import {Agrupador} from "../../../../../../../web/domain/entity/avaliacao/agrupador.model";
import {FormBuilder} from "@angular/forms";
import {Subject} from "rxjs";
import {viewAnimation} from "../../../../../../../web/domain/presentation/controls/utils";
import {environment} from "../../../../../../../environments/environment";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'authenticate-to-logout',
  templateUrl: './authenticate-to-logout.component.html',
  styleUrls: ['./authenticate-to-logout.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class AuthenticateToLogoutComponent implements OnInit, OnDestroy {

  /**
   *
   * @type {string}
   */
  logoImage: string = environment.endpoint + 'assets/images/ubest1.png';

  /**
   *
   */
  backgroundPath: string = environment.endpoint + 'assets/images/banner.png';

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
   * @param _sanitizer
   * @param fb
   * @param {MobileService} mobileService
   * @param element
   * @param renderer
   * @param snackBar
   * @param {Router} router
   */
  constructor(private _sanitizer: DomSanitizer,
              private mobileService: MobileService,
              @Inject(ElementRef) private element: ElementRef,
              private router: Router, private renderer: Renderer,
              private snackBar: MatSnackBar, private fb: FormBuilder) {
  }

  /**
   *
   */
  ngOnInit() {

    // Registra o loading e restarta o timeout
    this.mobileService.restartTimeout();
    this.mobileService.register('overlayStarSyntax');

    // Se não tem senha ou não tem o dispositivo
    if (!this.mobileService.token) {

      this.router.navigate(['/configuracoes']);

      // Resolve o loading e limpa o timeout
      this.mobileService.clearTimeout();
      this.mobileService.resolve('overlayStarSyntax');
      return
    }

    // Debounce da digitação, toda vez que o usuário digita alguma coisa, depois de 300 milisegundos ele executa isso.
    this.modelChanged.debounceTime(300).subscribe(model => {
      if (model && model.length && (model.length === 6 || model.length === 8)) {

          // Restarta o timeout e Registra o loading
          this.mobileService.restartTimeout();
          this.mobileService.register('overlayStarSyntax');

          this.mobileService.logout(model).then(() => {
            this.mobileService.agrupador = new Agrupador();

            // Resolve o loading
            this.mobileService.resolve('overlayStarSyntax');

            this.router.navigate(['/configuracoes'])
          }).catch(error => {
            this.error(error);
            // Resolve o loading
            this.mobileService.resolve('overlayStarSyntax')
          })
      }
    });

    // Resolve o loading e limpa o timeout
    this.mobileService.clearTimeout();
    this.mobileService.resolve('overlayStarSyntax')
  }

  /**
   *
   */
  cancelar() {
    // Registra o loading.
    this.mobileService.register('overlayStarSyntax');
    this.mobileService.agrupador = new Agrupador();
    this.mobileService.requestDispositivoAutenticada().toPromise().then(result => {
      if (result) {
        this.mobileService.dispositivo = result;
        this.router.navigate(['/avaliar/' + this.mobileService.dispositivo.numeroLicenca]);
        // Resolve o loading
        this.mobileService.resolve('overlayStarSyntax')
      } else {
        this.router.navigate(['/error']);
        // Resolve o loading
        this.mobileService.resolve('overlayStarSyntax')
      }
    }).catch(() => {
      this.router.navigate(['/error']);
      // Resolve o loading
      this.mobileService.resolve('overlayStarSyntax')
    })
  }

  /**
   *
   * @param image
   */
  getBackground(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`)
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

  /**
   *
   */
  ngOnDestroy(): void {
    // Restarta o timeout e resolve o loading
    this.mobileService.restartTimeout();
    this.mobileService.resolve('overlayStarSyntax')
  }

}
