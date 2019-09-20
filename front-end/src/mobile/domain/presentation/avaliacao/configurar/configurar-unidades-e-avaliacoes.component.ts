import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MobileService} from '../../../service/mobile.service';
import {UnidadeService} from '../../../../../web/domain/service/unidade.service';
import {MatSnackBar} from "@angular/material";
import {TdLoadingService} from "@covalent/core";
import {viewAnimation} from "../../../../../web/domain/presentation/controls/utils";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../web/domain/repository/unidade-tipo-avaliacao.repository";
import {Subject} from "rxjs";
import {Dispositivo} from "../../../../../web/domain/entity/avaliacao/dispositivo.model";
import {WebSocketSubject} from "rxjs/webSocket";

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
  model: any;

  /**
   *
   */
  unidades: any;

  /**
   *
   */
  senha: string = null;

  /**
   *
   */
  numeroSerie: string = '143037';

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
   * @param {MatSnackBar} snackBar
   * @param {MobileService} mobileService
   * @param {UnidadeService} unidadeService
   * @param _loadingService
   * @param unidadeTipoAvaliacaoRepository
   */
  constructor(private _loadingService: TdLoadingService,
              private unidadeService: UnidadeService, private router: Router,
              private mobileService: MobileService, private snackBar: MatSnackBar,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    this.numeroLicencaChanged.debounceTime(1000).distinctUntilChanged().subscribe(model => {
        if (this.webSocketSubject)
          this.webSocketSubject.unsubscribe();
        this.webSocketSubject = this.mobileService.connect(model);

        this.webSocketSubject.subscribe(result => {
          this.mobileService.dispositivo = Object.assign({}, result);
          this.mobileService.dispositivo.numeroSerie = this.numeroSerie;

          if (this.mobileService.dispositivo.numeroSerie !== result.numeroSerie && !result.emUso) {
            console.log('Enviando número de série!');
            this.mobileService.getDispositivo(this.mobileService.dispositivo.numeroLicenca, this.mobileService.dispositivo.numeroSerie)
          } else if (this.mobileService.dispositivo.numeroSerie !== result.numeroSerie && result.emUso) {
            alert('Licença em uso')
          }
        })
      }
    )
  }

  /**
   *
   * @param {string} $event
   */
  public inputNumeroLicencaChanged($event: string) {
    if ($event && $event.length)
      if ($event.length === 6)
        this.numeroLicencaChanged.next($event);
  }

  /**
   *
   * @param {string} $event
   */
  public inputSenhaChanged($event) {
    if ($event && $event.length)
      if ($event.length === 6)
        this.mobileService.authenticate(this.mobileService.dispositivo.numeroLicenca, $event);
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
