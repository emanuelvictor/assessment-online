import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Unidade} from "../../../../../entity/unidade/unidade.model";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../repository/unidade-tipo-avaliacao.repository";
import {UnidadeTipoAvaliacaoLicenca} from "../../../../../entity/avaliacao/unidade-tipo-avaliacao-licenca.model";

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
  public unidadesTiposAvaliacoesLicenca: any;

  /**
   *
   * @type {EventEmitter}
   */
  @Output()
  public unidadesTiposAvaliacoesLicencaChange = new EventEmitter();

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

    if (unidade.unidadeTipoAvaliacaoLicencaValue)
      this.listTiposAvaliacoesByUnidadeId(unidade);

    else if (unidade.unidadesTiposAvaliacoes && unidade.unidadesTiposAvaliacoes.length) {
      unidade.unidadesTiposAvaliacoes.forEach(unidadeTipoAvaliacao => unidadeTipoAvaliacao.unidadeTipoAvaliacaoLicenca.ordem = 5);
      this.changeUnidadeTipoAvaliacaoLicencaOneTransaction(unidade);
    }
  }

  public changeUnidadeTipoAvaliacaoLicencaOneTransaction(unidade) {
    for (let k = 0; k < unidade.unidadesTiposAvaliacoes.length; k++) {
      if (!unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoLicenca) {
        const unidadeTipoAvaliacaoLicenca: UnidadeTipoAvaliacaoLicenca = new UnidadeTipoAvaliacaoLicenca();
        unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao = unidade.unidadesTiposAvaliacoes[k];
        unidadeTipoAvaliacaoLicenca.ativo = true; /*(unidadeTipoAvaliacao as any).checked*/
        unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoLicenca = unidadeTipoAvaliacaoLicenca
      }

      // unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoLicenca.licenca = this.licenca;

      if (unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoLicenca.ordem) {

        for (let i = 0; i < unidade.unidadesTiposAvaliacoes.length; i++)
          if (unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoLicenca.ordem > unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoLicenca.ordem)
            unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoLicenca.ordem = unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoLicenca.ordem - 1;

        unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoLicenca.ordem = null;
        unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoLicenca.ativo = false;

        continue
      }

      let aux = 0;

      for (let i = 0; i < unidade.unidadesTiposAvaliacoes.length; i++)
        if (unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoLicenca && unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoLicenca.ordem && unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoLicenca.ordem > aux)
          aux = unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoLicenca.ordem;

      unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoLicenca.ordem = aux + 1;
      unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoLicenca.ativo = true

    }

    this.unidadesTiposAvaliacoesLicencaChange.emit(unidade.unidadesTiposAvaliacoes.map(unidadeTipoAvaliacao => {
      unidadeTipoAvaliacao.unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao = unidadeTipoAvaliacao;
      return unidadeTipoAvaliacao.unidadeTipoAvaliacaoLicenca
    }))
  }

  /**
   *
   * @param unidadeTipoAvaliacao
   * @param unidade
   */
  public changeUnidadeTipoAvaliacaoLicenca(unidadeTipoAvaliacao, unidade) {

    if (!unidadeTipoAvaliacao.unidadeTipoAvaliacaoLicenca) {
      const unidadeTipoAvaliacaoLicenca: UnidadeTipoAvaliacaoLicenca = new UnidadeTipoAvaliacaoLicenca();
      unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao = unidadeTipoAvaliacao;
      unidadeTipoAvaliacaoLicenca.ativo = true; /*(unidadeTipoAvaliacao as any).checked*/
      unidadeTipoAvaliacao.unidadeTipoAvaliacaoLicenca = unidadeTipoAvaliacaoLicenca
    }

    // unidadeTipoAvaliacao.unidadeTipoAvaliacaoLicenca.licenca = this.licenca;

    if (unidadeTipoAvaliacao.unidadeTipoAvaliacaoLicenca.ordem) {

      for (let i = 0; i < unidade.unidadesTiposAvaliacoes.length; i++)
        if (unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoLicenca.ordem > unidadeTipoAvaliacao.unidadeTipoAvaliacaoLicenca.ordem)
          unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoLicenca.ordem = unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoLicenca.ordem - 1;

      unidadeTipoAvaliacao.unidadeTipoAvaliacaoLicenca.ordem = null;
      unidadeTipoAvaliacao.unidadeTipoAvaliacaoLicenca.ativo = false;
      this.unidadesTiposAvaliacoesLicencaChange.emit(unidade.unidadesTiposAvaliacoes.map(unidadeTipoAvaliacao => unidadeTipoAvaliacao.unidadeTipoAvaliacaoLicenca));

      return
    }

    let aux = 0;

    for (let i = 0; i < unidade.unidadesTiposAvaliacoes.length; i++)
      if (unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoLicenca && unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoLicenca.ordem && unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoLicenca.ordem > aux)
        aux = unidade.unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoLicenca.ordem;

    unidadeTipoAvaliacao.unidadeTipoAvaliacaoLicenca.ordem = aux + 1;
    unidadeTipoAvaliacao.unidadeTipoAvaliacaoLicenca.ativo = true;

    // Handler de quando tem um novo tipo de avaliação
    if (!unidadeTipoAvaliacao.unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao)
      unidadeTipoAvaliacao.unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao = Object.assign(unidadeTipoAvaliacao, {});

    this.unidadesTiposAvaliacoesLicencaChange.emit(unidade.unidadesTiposAvaliacoes.map(unidadeTipoAvaliacao => unidadeTipoAvaliacao.unidadeTipoAvaliacaoLicenca));
  }

  /**
   *
   * @param {Unidade} unidade
   */
  public listTiposAvaliacoesByUnidadeId(unidade) {
    this.unidadeTipoAvaliacaoRepository.listByFilters({unidadeId: unidade.id, ativo: true}).subscribe(page => {

      for (let k = 0; k < page.content.length; k++) {
        page.content[k].unidadeTipoAvaliacaoLicenca = {unidadeTipoAvaliacao: page.content[k]};
        for (let i = 0; i < unidade.unidadesTiposAvaliacoes.length; i++)
          if (unidade.unidadesTiposAvaliacoes[i].id === page.content[k].id)
            page.content[k] = unidade.unidadesTiposAvaliacoes[i];
      }

      unidade.unidadesTiposAvaliacoes = page.content;

      if (!unidade.unidadesTiposAvaliacoes.filter(a => a.unidadeTipoAvaliacaoLicenca.ativo).length) {
        this.changeUnidadeTipoAvaliacaoLicencaOneTransaction(unidade);
        unidade.unidadesTiposAvaliacoes.forEach(unidadeTipoAvaliacaoLicenca => {
          unidadeTipoAvaliacaoLicenca.ativo = true
        })
      }
    })
  }

}
