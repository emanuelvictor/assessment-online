import {Component, EventEmitter, Input, Output} from '@angular/core';
import {viewAnimation} from "../../../../controls/utils";
import {Avaliavel} from "../../../../../entity/usuario/vinculo/avaliavel.model";
import {Unidade} from "../../../../../entity/unidade/unidade.model";
import {AvaliavelRepository} from "../../../../../repository/avaliavel.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../repository/unidade-tipo-avaliacao.repository";
import {Usuario} from "../../../../../entity/usuario/usuario.model";

@Component({
  selector: 'visualizar-vinculo-unidade',
  templateUrl: './visualizar-vinculo-unidade.component.html',
  styleUrls: ['./visualizar-vinculo-unidade.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class VisualizarVinculoUnidadeComponent {

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
  public operadores: any;

  /**
   *
   * @type {EventEmitter}
   */
  @Output()
  public operadoresChange = new EventEmitter();

  /**
   *
   */
  @Input()
  public avaliaveis: any;

  /**
   *
   * @type {EventEmitter}
   */
  @Output()
  public avaliaveisChange = new EventEmitter();

  /**
   *
   */
  @Input()
  usuario: Usuario;

  /**
   *
   * @param {AvaliavelRepository} avaliavelRepository
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   */
  constructor(private avaliavelRepository: AvaliavelRepository,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {
  }

  /**
   *
   * @param unidade
   */
  public changeAvaliavel(unidade) {
    if (unidade.avaliavelValue)
      this.listTiposAvaliacoesByUnidadeId(unidade);
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
                unidade.unidadesTiposAvaliacoes[k].checked = aux[i].avaliavel.ativo;
                unidade.unidadesTiposAvaliacoes[k].avaliavel = aux[i].avaliavel;
              }
            }
      }
    );
  }

  /**
   *
   * @param unidadeTipoAvaliacaoLicenca
   */
  public changeUnidadeTipoAvaliacaoLicenca(unidadeTipoAvaliacaoLicenca) {

    let avaliavel: Avaliavel = new Avaliavel();
    avaliavel.usuario = this.usuario;
    avaliavel.unidadeTipoAvaliacaoLicenca = unidadeTipoAvaliacaoLicenca;

    for (let i = 0; i < this.avaliaveis.length; i++)
      if (this.avaliaveis[i].unidadeTipoAvaliacaoLicenca.id === unidadeTipoAvaliacaoLicenca.id)
        avaliavel = this.avaliaveis[i];

    avaliavel.ativo = (unidadeTipoAvaliacaoLicenca as any).checked;

  }
}
