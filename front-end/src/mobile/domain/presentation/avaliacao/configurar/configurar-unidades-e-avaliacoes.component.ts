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
  numeroSerie: string = '852456';

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

    this.numeroLicencaChanged.debounceTime(1000).distinctUntilChanged().subscribe(model => {
        if (this.webSocketSubject)
          this.webSocketSubject.unsubscribe();
        this.webSocketSubject = this.mobileService.connect(model);

        this.webSocketSubject.subscribe(result => {
          this.mobileService.dispositivo = Object.assign({}, result);
          this.mobileService.dispositivo.numeroSerie = Object.assign({}, this.numeroSerie);

          if (this.mobileService.dispositivo.numeroSerie !== result.numeroSerie && !result.emUso) {
            console.log('Enviando número de série!');
            this.mobileService.sendNumeroSerie(this.mobileService.dispositivo.numeroSerie)
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
        this.mobileService.authenticate($event);
  }

  /**
   *
   */
  ngOnInit() {
    // // Inicia o loading
    // this._loadingService.register('overlayStarSyntax');
    //
    // // Mata o timeout se houver (Aqui não precisa de timeout)
    // this.mobileService.clearTimeout();
    //
    // // Zera o model
    // this.mobileService.agrupador = new Agrupador();
    //
    // // Inicia o carregamento das unidades
    // this.consultarUnidades()
  }

  /**
   *
   */
  consultarUnidades() {

    this.unidadeService.listLightByFilters({
      withAvaliaveisFilter: true,
      withUnidadesTiposAvaliacoesAtivasFilter: true
    }).subscribe(result => {
      this.unidades = result.content;

      // Se só houver uma unidade.
      if (this.unidades.length === 1) {

        // Se só houver uma unidade, seleciona a primeira.
        this.unidades[0].checked = true;

        this.unidadeTipoAvaliacaoRepository.listByUnidadeId({unidadeId: this.unidades[0].id, ativo: true})
          .subscribe(resulted => {

            // Assinala todos os tipos de avaliações como checkes, ou seja, marcados no checkbox.
            // Define as ordens dos tipos de avaliações
            for (let i = 0; i < resulted.content.length; i++) {
              resulted.content[i].checked = true;
              resulted.content[i].ordem = i + 1;
            }

            // Popula lista do model.
            this.unidades[0].unidadesTiposAvaliacoes = resulted.content;

            // Se só houver somente um tipo de avaliação.
            if (resulted.content.length === 1) {
              // Vai para o próximo passo.
              this.proximo(this.unidades);
              // Encerra o loading.
              this._loadingService.resolve('overlayStarSyntax');
              return
            }

            // Encerra o loading
            this._loadingService.resolve('overlayStarSyntax');
          })
      } else {
        this._loadingService.resolve('overlayStarSyntax')
      }
    })
  }

  /**
   *
   * @param unidade
   */
  afterExpand(unidade) {

    this.unidadeTipoAvaliacaoRepository.listByUnidadeId({unidadeId: unidade.id, ativo: true}).subscribe(result => {

      if (!result.content.length) {
        this.openSnackBar('Vincule Itens Avaliáveis á esses Tipos de Avaliações');
        unidade.checked = false;
        return
      }

      unidade.checked = true;

      for (let i = 0; i < result.content.length; i++) {
        result.content[i].unidade = unidade;
        result.content[i].checked = true;
        result.content[i].ordem = i + 1
      }

      unidade.unidadesTiposAvaliacoes = result.content

    })
  }

  /**
   *
   * @param unidade
   */
  afterCollapse(unidade) {
    unidade.checked = false;
    unidade.unidadesTiposAvaliacoes = []
  }

  /**
   *
   * @param unidadeTipoAvaliacao
   */
  changeUnidadeTipoAvaliacao(unidadeTipoAvaliacao) {
    unidadeTipoAvaliacao.unidade.checked = unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes && (unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes.filter(unidadeTipoAvaliaca => unidadeTipoAvaliaca.checked).length > 0);

    if (unidadeTipoAvaliacao.ordem) {

      for (let i = 0; i < unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes.length; i++) {
        if (unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes[i].ordem > unidadeTipoAvaliacao.ordem) {
          unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes[i].ordem = unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes[i].ordem - 1;
        }
      }

      unidadeTipoAvaliacao.ordem = null;

      return
    }

    let aux = 0;

    for (let i = 0; i < unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes.length; i++) {
      if (unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes[i].ordem && unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes[i].ordem > aux) {
        aux = unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes[i].ordem
      }
    }

    unidadeTipoAvaliacao.ordem = aux + 1
  }

  /**
   *
   * @param unidades
   */
  public proximo(unidades: any) {
    this._loadingService.register('overlayStarSyntax');
    const unidadesTiposAvaliacoes = [];

    unidades.filter(unidade => unidade.checked).map(unidade => unidade.unidadesTiposAvaliacoes).forEach(a => {
      a.forEach(b => {
        if (b.checked) {
          unidadesTiposAvaliacoes.push(b)
        }
      })
    });

    //
    this.mobileService.unidadesTiposAvaliacoes = unidadesTiposAvaliacoes;
    this.mobileService.unidades = unidades.filter(unidade => unidade.checked);

    //
    if (!this.mobileService.unidadesTiposAvaliacoes.length || !this.mobileService.unidades.length) {
      this._loadingService.resolve('overlayStarSyntax');
      return
    }

    // Zera os hashs
    this.mobileService.localStorage.removeHashs();

    //
    this.mobileService.requestUnidades().then(unidadess => {
      for (let i = 0; i < unidadess.length; i++) {

        this.mobileService.setHashsByUnidadeId(unidadess[i].id).then(() => {
          if (i === unidadess.length - 1) {
            this.router.navigate(['avaliar']);
            this._loadingService.resolve('overlayStarSyntax')
          }
        })
      }
    })

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
