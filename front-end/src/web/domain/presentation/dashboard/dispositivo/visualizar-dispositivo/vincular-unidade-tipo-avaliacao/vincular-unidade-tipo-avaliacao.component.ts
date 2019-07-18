import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Unidade} from "../../../../../entity/unidade/unidade.model";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../repository/unidade-tipo-avaliacao.repository";
import {Dispositivo} from "../../../../../entity/avaliacao/dispositivo.model";
import {UnidadeTipoAvaliacaoDispositivo} from "../../../../../entity/avaliacao/unidade-tipo-avaliacao-dispositivo.model";

@Component({
  selector: 'vincular-unidade-tipo-avaliacao',
  templateUrl: 'vincular-unidade-tipo-avaliacao.component.html',
  styleUrls: ['vincular-unidade-tipo-avaliacao.component.scss']
})
export class VincularUnidadeTipoAvaliacaoComponent {

  /**
   * Unidades do sistema
   */
  @Input()
  public unidades: any;

  /**
   *
   * @type {EventEmitter}
   */
  @Output()
  public unidadesChange = new EventEmitter();

  /**
   *
   */
  @Input()
  public unidadesTiposAvaliacoesDispositivo: any;

  /**
   *
   * @type {EventEmitter}
   */
  @Output()
  public unidadesTiposAvaliacoesDispositivoChange = new EventEmitter();

  /**
   *
   */
  @Input()
  public filter: any = {
    unidade: {}
  };

  /**
   *
   */
  @Input()
  dispositivo: Dispositivo;

  /**
   *
   */
  @Output()
  saveUnidadeTipoAvaliacaoDispositivo: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  removeUnidadeTipoAvaliacaoDispositivo: EventEmitter<any> = new EventEmitter();

  /**
   *
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   */
  constructor(private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {
  }

  /**
   *
   * @param unidade
   */
  public changeUnidadeTipoAvaliacaoFromClick(unidade) {
console.log('changeUnidadeTipoAvaliacaoFromClick')
    // this.unidadeTipoAvaliacaoRepository.listByFilters({unidadeId: unidade.id, ativo: true}).subscribe(page => {
    //
    //   for (let k = 0; k < page.content.length; k++) {
    //     page.content[k].unidadeTipoAvaliacaoDispositivo = {unidadeTipoAvaliacao: page.content[k]};
    //     for (let i = 0; i < unidade.unidadesTiposAvaliacoes.length; i++) {
    //       if (unidade.unidadesTiposAvaliacoes[i].id === page.content[k].id)
    //         page.content[k] = unidade.unidadesTiposAvaliacoes[i];
    //     }
    //   }
    //
    //   unidade.unidadesTiposAvaliacoes = page.content;
    // })
  }

  /**
   *
   * @param unidade
   */
  public changeUnidadeTipoAvaliacao(unidade) {

    if (unidade.unidadeTipoAvaliacaoDispositivoValue)
      this.listTiposAvaliacoesByUnidadeId(unidade);

    else if (unidade.unidadesTiposAvaliacoes && unidade.unidadesTiposAvaliacoes.length)
      for (let k = 0; k < unidade.unidadesTiposAvaliacoes.length; k++) {
        // if (!unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoDipositivo)
        //   unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoDipositivo = new UnidadeTipoAvaliacaoDispositivo();
        // unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoDipositivo.ativo = false;
        this.changeUnidadeTipoAvaliacaoDispositivo(unidade.unidadesTiposAvaliacoes[k], unidade)
      }
  }

  /**
   *
   * @param unidadeTipoAvaliacao
   * @param unidade
   */
  public changeUnidadeTipoAvaliacaoDispositivo(unidadeTipoAvaliacao, unidade) {

    if (!unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo) {
      let unidadeTipoAvaliacaoDispositivo: UnidadeTipoAvaliacaoDispositivo = new UnidadeTipoAvaliacaoDispositivo();
      unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao = unidadeTipoAvaliacao;
      unidadeTipoAvaliacaoDispositivo.ativo = true; /*(unidadeTipoAvaliacao as any).checked*/
      unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo = unidadeTipoAvaliacaoDispositivo;
    }

    unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo.dispositivo = this.dispositivo;

    if (unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo.ordem) {

      for (let i = 0; i < unidade.unidadesTiposAvaliacoes.length; i++) {
        if (unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo.ordem > unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo.ordem) {
          unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo.ordem = unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo.ordem - 1;
        }
      }

      unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo.ordem = null;

      this.removeUnidadeTipoAvaliacaoDispositivo.emit(unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo);

      return
    }

    let aux = 0;

    for (let i = 0; i < unidade.unidadesTiposAvaliacoes.length; i++) {
      if (unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo && unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo.ordem && unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo.ordem > aux) {
        aux = unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo.ordem
      }
    }

    unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo.ordem = aux + 1;

    this.saveUnidadeTipoAvaliacaoDispositivo.emit(unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo)
  }

  /**
   *
   * @param {Unidade} unidade
   */
  public listTiposAvaliacoesByUnidadeId(unidade) {
    this.unidadeTipoAvaliacaoRepository.listByFilters({unidadeId: unidade.id, ativo: true}).subscribe(page => {

      for (let k = 0; k < page.content.length; k++) {
        page.content[k].unidadeTipoAvaliacaoDispositivo = {unidadeTipoAvaliacao: page.content[k]};
        for (let i = 0; i < unidade.unidadesTiposAvaliacoes.length; i++) {
          if (unidade.unidadesTiposAvaliacoes[i].id === page.content[k].id)
            page.content[k] = unidade.unidadesTiposAvaliacoes[i];
        }
      }

      unidade.unidadesTiposAvaliacoes = page.content;
    })
  }

}
