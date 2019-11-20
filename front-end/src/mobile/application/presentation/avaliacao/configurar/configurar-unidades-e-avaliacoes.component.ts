import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {MatSnackBar} from '@angular/material';
import {viewAnimation} from '@src/sistema/application/presentation/controls/utils';
import {Dispositivo} from '@src/sistema/domain/entity/avaliacao/dispositivo.model';
import {environment} from '@src/environments/environment';
import {ConfiguracaoRepository} from '@src/sistema/domain/repository/configuracao.repository';
import {MobileService} from '@src/mobile/domain/service/mobile.service';
import {Agrupador} from '@src/sistema/domain/entity/avaliacao/agrupador.model';

@Component({
  selector: 'configurar-unidades-e-avaliacoes',
  templateUrl: './configurar-unidades-e-avaliacoes.component.html',
  styleUrls: ['./configurar-unidades-e-avaliacoes.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class ConfigurarUnidadesEAvaliacoesComponent implements OnInit {

  /**
   *
   */
  public dispositivo: Dispositivo = new Dispositivo();

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
  senha: string = null;

  /**
   *
   * @param {Router} router
   * @param _sanitizer
   * @param {ConfiguracaoRepository} configuracaoRepository
   * @param mobileService
   * @param snackBar
   */
  constructor(private _sanitizer: DomSanitizer,
              public mobileService: MobileService,
              private snackBar: MatSnackBar, private router: Router,
              private configuracaoRepository: ConfiguracaoRepository) {
  }

  /**
   *
   */
  async ngOnInit() {
    // Se tem o token, destroy o token e os cookies
    if (this.mobileService.token && !this.mobileService.senha) {
      this.mobileService.destroyCookies();
    } else if (this.mobileService.token && this.mobileService.senha) {
      const dispositivo: Dispositivo = (await this.mobileService.getLocalDispositivoOrDispositivoAutenticadoOrDispositivoByNumeroLicenca());
      if (dispositivo && dispositivo.id) {
        await this.router.navigate(['/avaliar/' + dispositivo.id]);
        return
      }
    }

    // Zera o agrupador
    this.mobileService.agrupador = new Agrupador();

    // Zera o dispositivo
    this.mobileService.dispositivo = new Dispositivo();


    // // Se está nessa tela, então libera os bloqueios do tablet
    // if ((window as any) && (window as any).plugins && (window as any).plugins['insomnia']) {
    //   (window as any).plugins['insomnia'].allowSleepAgain();
    // }
    //
    // // Se está nessa tela, então libera os bloqueios do tablet
    // if (window && window['KioskPlugin']) {
    //   window['KioskPlugin'].exitKiosk()
    // }

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
   * @param {string} $event
   */
  public inputCodigoChanged($event) {
    if ($event) {
      if ($event > 100000) {
        this.mobileService.authenticateByCodigo(this.mobileService.numeroSerie, $event).then(() =>
          this.router.navigate(['/avaliar/' + this.mobileService.dispositivo.id])
        )
      }
    }
  }

  // /**
  //  *
  //  * @param message
  //  */
  // public showMessage(message: string) {
  //   this.openSnackBar(message)
  // }
  //
  // /**
  //  *
  //  * @param message
  //  */
  // public openSnackBar(message: string) {
  //   this.snackBar.open(message, 'Fechar', {
  //     duration: 5000
  //   })
  // }

}
