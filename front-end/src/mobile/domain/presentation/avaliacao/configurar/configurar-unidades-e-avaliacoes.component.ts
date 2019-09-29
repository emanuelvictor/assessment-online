import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MobileService} from '../../../service/mobile.service';
import {getIdentifier, viewAnimation} from "../../../../../web/domain/presentation/controls/utils";
import {Dispositivo} from "../../../../../web/domain/entity/avaliacao/dispositivo.model";
import {environment} from "../../../../../environments/environment";
import {DomSanitizer} from "@angular/platform-browser";
import {ConfiguracaoRepository} from "../../../../../web/domain/repository/configuracao.repository";
import {MatSnackBar} from "@angular/material";
import {Agrupador} from "../../../../../web/domain/entity/avaliacao/agrupador.model";

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
              private mobileService: MobileService,
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
      const dispositivo: Dispositivo = (await this.mobileService.gedispositivo());
      if (dispositivo && dispositivo.numeroLicenca) {
        this.router.navigate(['/avaliar/' + dispositivo.numeroLicenca]);
        return
      }
    }

    // Zera o agrupador
    this.mobileService.agrupador = new Agrupador();

    // Zera o dispositivo
    this.mobileService.dispositivo = new Dispositivo();

  }

  /**
   *
   * @param model
   */
  authenticate(model) {

    this.mobileService.getDispositivo(model as any).toPromise().then(result => {

      this.mobileService.dispositivo = Object.assign({}, result);
      this.mobileService.dispositivo.numeroSerie = this.mobileService.numeroSerie;

      // Atualiza o plano de fundo
      this.requestBackground();

      // Se tem número de série, então está em um dispositivo físico.
      if (this.mobileService.numeroSerie) {

        if (this.mobileService.dispositivo.numeroSerie !== result.numeroSerie) {

          if (!result.emUso) {
            this.mobileService.getDispositivo(this.mobileService.dispositivo.numeroLicenca, this.mobileService.dispositivo.numeroSerie).subscribe(resulted => {
              if (resulted.interna) {
                this.mobileService.dispositivo = resulted;
              } else {
                this.error('Essa licença é para uso externo!')
              }
            });
          } else {
            this.error('Licença sendo utilizada em outro dispositivo!')
          }

        }

      }
      // Se não, então deve procurar avaliações públicas (externas)
      else {
        if (!result.interna) {
          this.router.navigate(['avaliar/' + this.mobileService.dispositivo.numeroLicenca]);
        } else {
          this.error('Essa licença é para uso interno!')
        }
      }

    })

  }

  /**
   *
   */
  private requestBackground() {
    const identifier: string = getIdentifier();
    this.logoImage = environment.endpoint + './configuracoes/logomarca?cliente=' + this.mobileService.dispositivo.tenant + '?nocache=' + identifier;

    if (this.mobileService.dispositivo.tenant === 'public') {
      this.backgroundPath = environment.endpoint + 'assets/images/banner.png';
    } else {
      this.backgroundPath = environment.endpoint + './configuracoes/background?cliente=' + this.mobileService.dispositivo.tenant + '?nocache=' + identifier;
    }
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
  public inputNumeroLicencaChanged($event) {
    if ($event && $event.length) {
      if ($event.length === 6) {
        this.authenticate($event)
      }
    }
  }

  /**
   *
   * @param {string} $event
   */
  public inputSenhaChanged($event) {
    if ($event && $event.length) {
      if ($event.length === 6) {
        this.mobileService.authenticate(this.mobileService.dispositivo.numeroLicenca, $event).then(() => {
          this.router.navigate(['avaliar/' + this.mobileService.dispositivo.numeroLicenca]);
        })
      }
    }
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
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    })
  }
}
