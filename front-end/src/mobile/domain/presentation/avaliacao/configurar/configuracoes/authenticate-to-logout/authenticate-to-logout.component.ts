import {Component, ElementRef, Inject, OnInit, Renderer} from "@angular/core";
import {MatSnackBar} from "@angular/material";
import {MobileService} from "../../../../../service/mobile.service";
import {Router} from "@angular/router";
import {Agrupador} from "../../../../../../../web/domain/entity/avaliacao/agrupador.model";
import {FormBuilder} from "@angular/forms";
import {TdLoadingService} from "@covalent/core";
import {Subject} from "rxjs";
import {viewAnimation} from "../../../../../../../web/domain/presentation/controls/utils";
import {environment} from "../../../../../../../environments/environment";
import {DomSanitizer} from "@angular/platform-browser";
import {LocalStorage} from "../../../../../../../web/infrastructure/local-storage/local-storage";

@Component({
  selector: 'authenticate-to-logout',
  templateUrl: './authenticate-to-logout.component.html',
  styleUrls: ['./authenticate-to-logout.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class AuthenticateToLogoutComponent implements OnInit {

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
   * @param _localStorage
   * @param fb
   * @param {MobileService} mobileService
   * @param _loadingService
   * @param element
   * @param renderer
   * @param snackBar
   * @param {Router} router
   */
  constructor(private _sanitizer: DomSanitizer,
              private _localStorage: LocalStorage,
              private mobileService: MobileService,
              private _loadingService: TdLoadingService,
              @Inject(ElementRef) private element: ElementRef,
              private router: Router, private renderer: Renderer,
              private snackBar: MatSnackBar, private fb: FormBuilder) {
  }

  /**
   *
   */
  ngOnInit(): void {
    // Se não tem senha ou não tem o dispositivo
    if (!this._localStorage.senha || !this.mobileService.dispositivo || !this.mobileService.dispositivo.numeroLicenca)
      this.router.navigate(['/configuracoes']);

    // Registra o loading.
    this._loadingService.register('overlayStarSyntax');

    // Reinicia o timeout
    this.mobileService.restartTimeout();

    // Resolve o loading
    this._loadingService.resolve('overlayStarSyntax');

    // Debounce da digitação, toda vez que o usuário digita alguma coisa, depois de 300 milisegundos ele executa isso.
    this.modelChanged.debounceTime(300).subscribe(model => {

      // Restarta o timeout
      this.mobileService.restartTimeout();

      if (model && model.length)
        if (model.length === 6){
          // Registra o loading.
          this._loadingService.register('overlayStarSyntax');
          this.mobileService.logout(model).then(() => {
            this.mobileService.agrupador = new Agrupador();
            this.router.navigate(['/configuracoes']);
            // Resolve o loading
            this._loadingService.resolve('overlayStarSyntax')
          }).catch(error => {
            this.error(error);
            // Resolve o loading
            this._loadingService.resolve('overlayStarSyntax');
          })
        }

    })
  }

  /**
   *
   */
  cancelar() {
    // Registra o loading.
    this._loadingService.register('overlayStarSyntax');
    this.mobileService.agrupador = new Agrupador();
    this.mobileService.requestDispositivoAutenticada().toPromise().then( result => {
      if(result){
        this.mobileService.dispositivo = result;
        this.router.navigate(['/avaliar/' + this.mobileService.dispositivo.numeroLicenca]);
        // Resolve o loading
        this._loadingService.resolve('overlayStarSyntax')
      } else {
        this.router.navigate(['/error']);
        // Resolve o loading
        this._loadingService.resolve('overlayStarSyntax')
      }
    }).catch( () => {
      this.router.navigate(['/error']);
      // Resolve o loading
      this._loadingService.resolve('overlayStarSyntax')
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
   * @param image
   */
  getLogomarca(image) {
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

}
