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
  public changeUnidadeTipoAvaliacao(unidade) {

    if (unidade.unidadeTipoAvaliacaoDispositivoValue)
      this.listTiposAvaliacoesByUnidadeId(unidade);

    else if (unidade.unidadesTiposAvaliacoes && unidade.unidadesTiposAvaliacoes.length)
      for (let k = 0; k < unidade.unidadesTiposAvaliacoes.length; k++) {
        unidade.unidadesTiposAvaliacoes[k].checked = false;
        this.changeUnidadeTipoAvaliacaoDispositivo(unidade.unidadesTiposAvaliacoes[k])
      }
  }

  /**
   *
   * @param unidadeTipoAvaliacao
   */
  public changeUnidadeTipoAvaliacaoDispositivo(unidadeTipoAvaliacao) {

    let unidadeTipoAvaliacaoDispositivo: UnidadeTipoAvaliacaoDispositivo = new UnidadeTipoAvaliacaoDispositivo();
    unidadeTipoAvaliacaoDispositivo.dispositivo = this.dispositivo;
    unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao = unidadeTipoAvaliacao;

    for (let i = 0; i < this.unidadesTiposAvaliacoesDispositivo.length; i++)
      if (this.unidadesTiposAvaliacoesDispositivo[i].unidadeTipoAvaliacao.id === unidadeTipoAvaliacao.id)
        unidadeTipoAvaliacaoDispositivo = this.unidadesTiposAvaliacoesDispositivo[i];

    unidadeTipoAvaliacaoDispositivo.ativo = (unidadeTipoAvaliacao as any).checked;

    if (!(unidadeTipoAvaliacao as any).checked)
      this.removeUnidadeTipoAvaliacaoDispositivo.emit(unidadeTipoAvaliacaoDispositivo);
    else
      this.saveUnidadeTipoAvaliacaoDispositivo.emit(unidadeTipoAvaliacaoDispositivo)
  }

  /**
   *
   * @param {Unidade} unidade
   */
  public listTiposAvaliacoesByUnidadeId(unidade) {

    this.unidadeTipoAvaliacaoRepository.listByFilters({unidadeId: unidade.id, ativo: true}).subscribe(page => {

      const aux = unidade.unidadesTiposAvaliacoes;

      unidade.unidadesTiposAvaliacoes = page.content;

      if (aux && aux.length)
        for (let i = 0; i < aux.length; i++)
          for (let k = 0; k < unidade.unidadesTiposAvaliacoes.length; k++) {
            if (unidade.unidadesTiposAvaliacoes[k].tipoAvaliacao.id === aux[i].tipoAvaliacao.id) {
              unidade.unidadesTiposAvaliacoes[k].checked = aux[i].unidadeTipoAvaliacaoDispositivo.ativo;
              unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoDispositivo = aux[i].unidadeTipoAvaliacaoDispositivo;
            }
          }
    })
  }

}
