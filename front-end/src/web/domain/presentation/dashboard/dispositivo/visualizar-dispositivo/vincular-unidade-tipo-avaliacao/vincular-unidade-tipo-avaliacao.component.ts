import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Unidade} from "../../../../../entity/unidade/unidade.model";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../repository/unidade-tipo-avaliacao.repository";
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
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   */
  constructor(private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {
  }

  /**
   *
   * @param unidade
   */
  public changeUnidadeTipoAvaliacao(unidade) {

    if (unidade.unidadeTipoAvaliacaoDispositivoValue)
      this.listTiposAvaliacoesByUnidadeId(unidade);

    else if (unidade.unidadesTiposAvaliacoes && unidade.unidadesTiposAvaliacoes.length) {
      unidade.unidadesTiposAvaliacoes.forEach(unidadeTipoAvaliacao => unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo.ordem = 5);
      this.changeUnidadeTipoAvaliacaoDispositivoOneTransaction(unidade);
    }
  }

  public changeUnidadeTipoAvaliacaoDispositivoOneTransaction(unidade) {
    for (let k = 0; k < unidade.unidadesTiposAvaliacoes.length; k++) {
      if (!unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoDispositivo) {
        const unidadeTipoAvaliacaoDispositivo: UnidadeTipoAvaliacaoDispositivo = new UnidadeTipoAvaliacaoDispositivo();
        unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao = unidade.unidadesTiposAvaliacoes[k];
        unidadeTipoAvaliacaoDispositivo.ativo = true; /*(unidadeTipoAvaliacao as any).checked*/
        unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoDispositivo = unidadeTipoAvaliacaoDispositivo
      }

      // unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoDispositivo.dispositivo = this.dispositivo;

      if (unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoDispositivo.ordem) {

        for (let i = 0; i < unidade.unidadesTiposAvaliacoes.length; i++)
          if (unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo.ordem > unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoDispositivo.ordem)
            unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo.ordem = unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo.ordem - 1;

        unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoDispositivo.ordem = null;
        unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoDispositivo.ativo = false;

        continue
      }

      let aux = 0;

      for (let i = 0; i < unidade.unidadesTiposAvaliacoes.length; i++)
        if (unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo && unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo.ordem && unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo.ordem > aux)
          aux = unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo.ordem;

      unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoDispositivo.ordem = aux + 1;
      unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoDispositivo.ativo = true

    }

    this.unidadesTiposAvaliacoesDispositivoChange.emit(unidade.unidadesTiposAvaliacoes.map(unidadeTipoAvaliacao => {
      unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao = unidadeTipoAvaliacao;
      return unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo
    }))
  }

  /**
   *
   * @param unidadeTipoAvaliacao
   * @param unidade
   */
  public changeUnidadeTipoAvaliacaoDispositivo(unidadeTipoAvaliacao, unidade) {

    if (!unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo) {
      const unidadeTipoAvaliacaoDispositivo: UnidadeTipoAvaliacaoDispositivo = new UnidadeTipoAvaliacaoDispositivo();
      unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao = unidadeTipoAvaliacao;
      unidadeTipoAvaliacaoDispositivo.ativo = true; /*(unidadeTipoAvaliacao as any).checked*/
      unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo = unidadeTipoAvaliacaoDispositivo
    }

    // unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo.dispositivo = this.dispositivo;

    if (unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo.ordem) {

      for (let i = 0; i < unidade.unidadesTiposAvaliacoes.length; i++)
        if (unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo.ordem > unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo.ordem)
          unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo.ordem = unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo.ordem - 1;

      unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo.ordem = null;
      unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo.ativo = false;
      this.unidadesTiposAvaliacoesDispositivoChange.emit(unidade.unidadesTiposAvaliacoes.map(unidadeTipoAvaliacao => unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo));

      return
    }

    let aux = 0;

    for (let i = 0; i < unidade.unidadesTiposAvaliacoes.length; i++)
      if (unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo && unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo.ordem && unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo.ordem > aux)
        aux = unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo.ordem;

    unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo.ordem = aux + 1;
    unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo.ativo = true;
    this.unidadesTiposAvaliacoesDispositivoChange.emit(unidade.unidadesTiposAvaliacoes.map(unidadeTipoAvaliacao => unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo));
  }

  /**
   *
   * @param {Unidade} unidade
   */
  public listTiposAvaliacoesByUnidadeId(unidade) {
    this.unidadeTipoAvaliacaoRepository.listByFilters({unidadeId: unidade.id, ativo: true}).subscribe(page => {

      for (let k = 0; k < page.content.length; k++) {
        page.content[k].unidadeTipoAvaliacaoDispositivo = {unidadeTipoAvaliacao: page.content[k]};
        for (let i = 0; i < unidade.unidadesTiposAvaliacoes.length; i++)
          if (unidade.unidadesTiposAvaliacoes[i].id === page.content[k].id)
            page.content[k] = unidade.unidadesTiposAvaliacoes[i];
      }

      unidade.unidadesTiposAvaliacoes = page.content;

      if (!unidade.unidadesTiposAvaliacoes.filter(a => a.unidadeTipoAvaliacaoDispositivo.ativo).length) {
        this.changeUnidadeTipoAvaliacaoDispositivoOneTransaction(unidade);
        unidade.unidadesTiposAvaliacoes.forEach(unidadeTipoAvaliacaoDispositivo => {
          unidadeTipoAvaliacaoDispositivo.ativo = true
        })
      }
    })
  }

}
