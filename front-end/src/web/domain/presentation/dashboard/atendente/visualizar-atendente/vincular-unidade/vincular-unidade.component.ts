import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Usuario} from '../../../../../entity/usuario/usuario.model';
import {Unidade} from "../../../../../entity/unidade/unidade.model";
import {Operador} from "../../../../../entity/usuario/vinculo/operador.model";
import {AvaliavelRepository} from "../../../../../repositories/avaliavel.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../repositories/unidade-tipo-avaliacao.repository";
import {Avaliavel} from "../../../../../entity/usuario/vinculo/avaliavel.model";

@Component({
  selector: 'vincular-unidade',
  templateUrl: './vincular-unidade.component.html',
  styleUrls: ['./vincular-unidade.component.scss']
})
export class VincularUnidadeComponent implements OnInit {

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
   * @type {Unidade}
   */
  @Input()
  public filter: any = {
    unidade: {}
  };

  /**
   *
   */
  @Input()
  usuario: Usuario;

  /**
   *
   */
  @Output()
  saveOperador: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  removeOperador: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  saveAvaliavel: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  removeAvaliavel: EventEmitter<any> = new EventEmitter();

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
   */
  ngOnInit() {
  }

  /**
   *
   * @param {Unidade} unidade
   */
  public saveOperadorInner(unidade: Unidade): void {
    if (!(unidade as any).operador) {
      const operador: Operador = new Operador();
      operador.usuario = this.usuario;

      const u = new Unidade();
      u.id = unidade.id;
      operador.unidade = u;
      (unidade as any).operador = operador;
    }

    if (!(unidade as any).operadorValue)
      this.removeOperador.emit((unidade as any).operador);
    else
      this.saveOperador.emit((unidade as any).operador)
  }

  /**
   *
   * @param unidade
   */
  public changeAvaliavel(unidade) {
    if (unidade.avaliavelValue)
      this.listTiposAvaliacoesByUnidadeId(unidade);

    else if (unidade.unidadesTiposAvaliacoes && unidade.unidadesTiposAvaliacoes.length)
      for (let k = 0; k < unidade.unidadesTiposAvaliacoes.length; k++) {
        unidade.unidadesTiposAvaliacoes[k].checked = false;
        this.changeUnidadeTipoAvaliacao(unidade.unidadesTiposAvaliacoes[k])
      }
  }

  /**
   *
   * @param unidadeTipoAvaliacao
   */
  public changeUnidadeTipoAvaliacao(unidadeTipoAvaliacao) {

    let avaliavel: Avaliavel = new Avaliavel();
    avaliavel.usuario = this.usuario;
    avaliavel.unidadeTipoAvaliacao = unidadeTipoAvaliacao;

    for (let i = 0; i < this.avaliaveis.length; i++)
      if (this.avaliaveis[i].unidadeTipoAvaliacao.id === unidadeTipoAvaliacao.id)
        avaliavel = this.avaliaveis[i];

    avaliavel.ativo = (unidadeTipoAvaliacao as any).checked;

    if (!(unidadeTipoAvaliacao as any).checked)
      this.removeAvaliavel.emit(avaliavel);
    else
      this.saveAvaliavel.emit(avaliavel);

  }

  /**
   *
   * @param {Unidade} unidade
   */
  public listTiposAvaliacoesByUnidadeId(unidade) {
    this.unidadeTipoAvaliacaoRepository.listByFilters({unidadeId: unidade.id, ativo: true})
      .subscribe(page => {

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

}
