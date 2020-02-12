import {Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {Subject} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {viewAnimation} from '@src/sistema/application/presentation/controls/utils';
import {environment} from '@src/environments/environment';
import {MobileService} from '@src/mobile/domain/service/mobile.service';
import {Agrupador} from '@src/sistema/domain/entity/avaliacao/agrupador.model';
import {Dispositivo} from '@src/sistema/domain/entity/avaliacao/dispositivo.model';
import 'rxjs/add/operator/debounceTime';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';

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
  logoImage: string = environment.endpoint + 'assets/images/logomarca-400x119.png';

  /**
   *
   */
  backgroundPath: string = environment.endpoint + 'assets/images/banner-1920x720.svg';

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
   * @param toastService
   * @param {Router} router
   */
  constructor(private _sanitizer: DomSanitizer,
              private mobileService: MobileService,
              @Inject(ElementRef) private element: ElementRef,
              private router: Router, private renderer: Renderer2,
              private toastService: ToastService, private fb: FormBuilder) {
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
      if (model && model > 100000) {

        // Restarta o timeout e Registra o loading
        this.mobileService.restartTimeout();
        this.mobileService.register('overlayStarSyntax');

        this.mobileService.logout(model).then(() => {
          this.mobileService.agrupador = new Agrupador();
          this.mobileService.dispositivo = new Dispositivo();

          // todo FALCATRUA
          this.mobileService.destroyCookies();

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

    // Remove the loading
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
        this.router.navigate(['/avaliar/' + this.mobileService.dispositivo.id]);
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
    this.toastService.open(message, 'Fechar', {
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
