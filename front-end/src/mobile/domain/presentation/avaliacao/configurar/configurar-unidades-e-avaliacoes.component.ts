import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MobileService} from '../../../service/mobile.service';
import {getIdentifier, viewAnimation} from "../../../../../web/domain/presentation/controls/utils";
import {Subject} from "rxjs";
import {Dispositivo} from "../../../../../web/domain/entity/avaliacao/dispositivo.model";
import {WebSocketSubject} from "rxjs/webSocket";
import {environment} from "../../../../../environments/environment";
import {DomSanitizer} from "@angular/platform-browser";
import {ConfiguracaoRepository} from "../../../../../web/domain/repository/configuracao.repository";
import {MatSnackBar} from "@angular/material";

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
   */
  public cliente: string = 'public';

  /**
   *
   * @type {string}
   */
  logoImage: string = environment.endpoint + './configuracoes/logomarca?cliente=public';

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
   */
  numeroSerie: string /*= '123130'*/;

  /**
   *
   */
  private webSocketSubject: WebSocketSubject<Dispositivo>;

  /**
   *
   * @type {Subject<string>}
   */
  private numeroLicencaChanged: Subject<string> = new Subject<string>();

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
  ngOnInit(): void {
    this.numeroLicencaChanged.debounceTime(1000).distinctUntilChanged().subscribe(model => {

      if (this.webSocketSubject)
        this.webSocketSubject.unsubscribe();
      this.webSocketSubject = this.mobileService.connect(model);

      this.webSocketSubject.subscribe(result => {

        this.mobileService.dispositivo = Object.assign({}, result);
        this.mobileService.dispositivo.numeroSerie = this.numeroSerie;

        this.configuracaoRepository.getClienteByUsername(this.mobileService.dispositivo.tenant).subscribe(result => {
          if (result !== this.cliente) {
            this.cliente = result;

            const identifier: string = getIdentifier();
            this.logoImage = environment.endpoint + './configuracoes/logomarca?cliente=' + this.cliente + '?nocache=' + identifier;

            if (this.cliente === 'public') {
              this.backgroundPath = environment.endpoint + 'assets/images/banner.png';
            } else {
              this.backgroundPath = environment.endpoint + './configuracoes/background?cliente=' + this.cliente + '?nocache=' + identifier;
            }
          }
        });

        // Se tem número de série, então está em um dispositivo físico.
        if (this.numeroSerie) {

          if (this.mobileService.dispositivo.numeroSerie !== result.numeroSerie) {

            if (!result.emUso)
              this.mobileService.getDispositivo(this.mobileService.dispositivo.numeroLicenca, this.mobileService.dispositivo.numeroSerie);
            else
              this.error('Licença sendo utilizada em outro dispositivo!')

          }

        }
        // Se não, então deve procurar avaliações públicas (externas)
        else {

          this.mobileService.getDispositivo(this.mobileService.dispositivo.numeroLicenca, null).then(resulted => {
            if (!resulted.interna)
              this.router.navigate([this.mobileService.dispositivo.numeroLicenca]);
            else
              this.error('Essa licença é para uso interno!')
          })

        }

      })

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
   * @param {string} $event
   */
  public inputNumeroLicencaChanged($event: string) {
    if ($event && $event.length)
      if ($event.length === 6)
        this.numeroLicencaChanged.next($event)
  }

  /**
   *
   * @param {string} $event
   */
  public inputSenhaChanged($event) {
    if ($event && $event.length)
      if ($event.length === 6)
        this.mobileService.authenticate(this.mobileService.dispositivo.numeroLicenca, $event).then(() => {
          this.router.navigate([this.mobileService.dispositivo.numeroLicenca]);
        })
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
