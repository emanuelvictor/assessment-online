import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from "@angular/material";
import {TdLoadingService} from "@covalent/core";
import {viewAnimation} from "../../../../controls/utils";
import {UnidadeService} from "../../../../../service/unidade.service";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../repository/unidade-tipo-avaliacao.repository";
import {UnidadeTipoAvaliacaoDispositivo} from "../../../../../entity/avaliacao/unidade-tipo-avaliacao-dispositivo.model";

@Component({
  selector: 'configurar-unidades-tipos-avaliacoes',
  templateUrl: './configurar-unidades-tipos-avaliacoes.component.html',
  styleUrls: ['./configurar-unidades-tipos-avaliacoes.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class ConfigurarUnidadesTiposAvaliacoesComponent implements OnInit {

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
  @Output()
  add: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  remove: EventEmitter<any> = new EventEmitter();

  /**
   *
   * @type {Unidade}
   */
  @Input()
  public filter: any = {
    unidade: {}
  };

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {UnidadeService} unidadeService
   * @param _loadingService
   * @param unidadeTipoAvaliacaoRepository
   */
  constructor(private unidadeService: UnidadeService,
              private _loadingService: TdLoadingService,
              private snackBar: MatSnackBar, private router: Router,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    // Inicia o loading
    this._loadingService.register('overlayStarSyntax');

    // Inicia o carregamento das unidades
    this.consultarUnidades()
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
        this.openSnackBar('Vincule Ítens Avaliáveis á esses Tipos de Avaliações');
        unidade.checked = false;
        return
      }

      unidade.checked = true;

      for (let i = 0; i < result.content.length; i++) {
        result.content[i].unidade = unidade;
        result.content[i].checked = true;
        result.content[i].ordem = i + 1
      }

      unidade.unidadesTiposAvaliacoes = result.content;

      unidade.unidadesTiposAvaliacoes.forEach(unidadeTipoAvaliacao => {
        const unidadeTipoAvaliacaoDispositivo: UnidadeTipoAvaliacaoDispositivo = new UnidadeTipoAvaliacaoDispositivo();
        unidadeTipoAvaliacaoDispositivo.ordem = unidadeTipoAvaliacao.ordem;
        unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao = unidadeTipoAvaliacao;
        this.add.emit(unidadeTipoAvaliacaoDispositivo)
      })
    })
  }

  /**
   *
   * @param unidade
   */
  afterCollapse(unidade) {
    unidade.unidadesTiposAvaliacoes.forEach(unidadeTipoAvaliacao => {
      const unidadeTipoAvaliacaoDispositivo: UnidadeTipoAvaliacaoDispositivo = new UnidadeTipoAvaliacaoDispositivo();
      unidadeTipoAvaliacaoDispositivo.ordem = unidadeTipoAvaliacao.ordem;
      unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao = unidadeTipoAvaliacao;
      this.remove.emit(unidadeTipoAvaliacaoDispositivo)
    });
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


      const unidadeTipoAvaliacaoDispositivo: UnidadeTipoAvaliacaoDispositivo = new UnidadeTipoAvaliacaoDispositivo();
      unidadeTipoAvaliacaoDispositivo.ordem = unidadeTipoAvaliacao.ordem;
      unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao = unidadeTipoAvaliacao;
      this.remove.emit(unidadeTipoAvaliacaoDispositivo);

      return
    }

    let aux = 0;

    for (let i = 0; i < unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes.length; i++) {
      if (unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes[i].ordem && unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes[i].ordem > aux) {
        aux = unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes[i].ordem
      }
    }

    unidadeTipoAvaliacao.ordem = aux + 1;

    const unidadeTipoAvaliacaoDispositivo: UnidadeTipoAvaliacaoDispositivo = new UnidadeTipoAvaliacaoDispositivo();
    unidadeTipoAvaliacaoDispositivo.ordem = unidadeTipoAvaliacao.ordem;
    unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao = unidadeTipoAvaliacao;
    this.add.emit(unidadeTipoAvaliacaoDispositivo)
  }

  // /**
  //  *
  //  */
  // private populateRetorno() {
  //   const retorno = [];
  //   if (this.unidades && this.unidades.length)
  //     for (let i = 0; i < this.unidades.length; i++) {
  //       if (this.unidades[i].unidadesTiposAvaliacoes && this.unidades[i].unidadesTiposAvaliacoes.length)
  //         for (let j = 0; j < this.unidades[i].unidadesTiposAvaliacoes.length; j++) {
  //           if (this.unidades[i].unidadesTiposAvaliacoes[j].checked) {
  //             const unidadeTipoAvaliacaoDispositivo: UnidadeTipoAvaliacaoDispositivo = new UnidadeTipoAvaliacaoDispositivo();
  //             unidadeTipoAvaliacaoDispositivo.ordem = this.unidades[i].unidadesTiposAvaliacoes[j].ordem;
  //             unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao = this.unidades[i].unidadesTiposAvaliacoes[j];
  //             retorno.push(unidadeTipoAvaliacaoDispositivo)
  //           }
  //         }
  //     }
  //
  //   return retorno;
  // }

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
