import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {MatSnackBar} from '@angular/material';
import {getIdentifier, viewAnimation} from '@src/web/domain/presentation/controls/utils';
import {Dispositivo} from '@src/web/domain/entity/avaliacao/dispositivo.model';
import {environment} from '@src/environments/environment';
import {ConfiguracaoRepository} from '@src/web/domain/repository/configuracao.repository';
import {MobileService} from '@src/mobile/domain/service/mobile.service';
import {Agrupador} from '@src/web/domain/entity/avaliacao/agrupador.model';

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
      if (dispositivo && dispositivo.numeroLicenca) {
        await this.router.navigate(['/avaliar/' + dispositivo.numeroLicenca]);
        return
      }
    }

    // Zera o agrupador
    this.mobileService.agrupador = new Agrupador();

    // Zera o dispositivo
    this.mobileService.dispositivo = new Dispositivo()

  }

  /**
   *
   * @param model
   */
  async getDispositivo(model) {

    // Pega o dispositivo e copio para o escopo do angular
    this.mobileService.dispositivo = await this.mobileService.getLocalDispositivoOrDispositivoAutenticadoOrDispositivoByNumeroLicenca(model as any);

    // Só prossegue se encontrou dispositivo
    if (!this.mobileService.dispositivo) {
      return;
    }

    // Se o dispositivo é interno
    if (this.mobileService.dispositivo.interna) {

      // Se o número de série provindo do dispositivo está nulo
      // Então Essa licença não está sendo utilizada por nenhum dispositivo ainda
      if (!this.mobileService.dispositivo.numeroSerie) {
        // Mando gerar uma senha para me autenticar
        // A view irá exibir a senha logo em seguida
        this.mobileService.getDispositivo(this.mobileService.dispositivo.numeroLicenca, this.mobileService.numeroSerie).subscribe(resulted => {
          // Atualiza o plano de fundo
          this.requestBackground();
          // Pega o dispositivo e copio para o escopo do angular
          this.mobileService.dispositivo = resulted
        })
      }
      // Caso contrário, e houver número de série no dispositivo do back-end, e este for igual ao local
      else if (this.mobileService.dispositivo.numeroSerie && this.mobileService.dispositivo.numeroSerie === this.mobileService.numeroSerie) {
        // Atualiza o plano de fundo
        this.requestBackground();
        // É o mesmo dispositivo, só mando autenticar
        this.showMessage('Reconectar o dispositivo!')
      }
      // Caso contrário, e houver número de série no dispositivo do back-end, e este for DIFERENTE ao local
      else if (this.mobileService.dispositivo.numeroSerie && this.mobileService.dispositivo.numeroSerie !== this.mobileService.numeroSerie) {
        // O usuário está tentando utilizar o mesmo número de série em diferentes dispositivos
        this.showMessage('Essa licença já está sendo utilizada em outro dispositivo');
        // Reseta o dispositivo
        this.mobileService.dispositivo = new Dispositivo()
      }
    }
    // Se não, então deve procurar avaliações públicas (externas)
    else if (!this.mobileService.dispositivo.interna) {
      // Atualiza o plano de fundo
      this.requestBackground();
      // Vai para execução da avaliação externa
      await this.router.navigate(['/avaliar/' + this.mobileService.dispositivo.numeroLicenca])
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
        this.getDispositivo($event)
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
        this.mobileService.authenticate(this.mobileService.dispositivo.numeroLicenca, this.mobileService.numeroSerie, $event).then(() => {
          this.router.navigate(['/avaliar/' + this.mobileService.dispositivo.numeroLicenca]);
        })
      }
    }
  }

  /**
   *
   * @param message
   */
  public showMessage(message: string) {
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
  private requestBackground() {
    const identifier: string = getIdentifier();
    this.logoImage = environment.endpoint + './configuracoes/logomarca?cliente=' + this.mobileService.dispositivo.tenant + '?nocache=' + identifier;

    if (this.mobileService.dispositivo.tenant === 'public') {
      this.backgroundPath = environment.endpoint + 'assets/images/banner.png';
    } else {
      this.backgroundPath = environment.endpoint + './configuracoes/background?cliente=' + this.mobileService.dispositivo.tenant + '?nocache=' + identifier;
    }
  }
}
