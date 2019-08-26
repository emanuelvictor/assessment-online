import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Usuario} from '../../../../../entity/usuario/usuario.model';
import {Unidade} from "../../../../../entity/unidade/unidade.model";
import {Operador} from "../../../../../entity/usuario/vinculo/operador.model";
import {AvaliavelRepository} from "../../../../../repository/avaliavel.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../repository/unidade-tipo-avaliacao.repository";
import {UnidadeTipoAvaliacaoDispositivoRepository} from "../../../../../repository/unidade-tipo-avaliacao-dispositivo.repository";
import {UnidadeTipoAvaliacao} from "../../../../../entity/avaliacao/unidade-tipo-avaliacao.model";

@Component({
  selector: 'vincular-unidade',
  templateUrl: './vincular-unidade.component.html',
  styleUrls: ['./vincular-unidade.component.scss']
})
export class VincularUnidadeComponent {

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
   * @param unidadeTipoAvaliacaoDispositivoRepository
   */
  constructor(private avaliavelRepository: AvaliavelRepository,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository,
              private unidadeTipoAvaliacaoDispositivoRepository: UnidadeTipoAvaliacaoDispositivoRepository) {
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

    if (!(unidade as any).operadorValue) {
      this.removeOperador.emit((unidade as any).operador);
    } else {
      this.saveOperador.emit((unidade as any).operador)
    }
  }

  /**
   *
   * @param unidade
   */
  public changeAvaliavel(unidade) {
    if (unidade.avaliavelValue) {

      this.emit(this.changeUnidadeAvaliavelValue(unidade, true))

    } else if (unidade.unidadesTiposAvaliacoes && unidade.unidadesTiposAvaliacoes.length) {

      let toEmit = [];

      for (let k = 0; k < unidade.unidadesTiposAvaliacoes.length; k++) {
        unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoValue = false;
        toEmit = toEmit.concat(this.changeUnidadeTipoAvaliacaoUnidadeTipoAvaliacaoValue(unidade.unidadesTiposAvaliacoes[k], unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoValue))
      }

      this.emit(toEmit);

      this.verifyUnidade(unidade)
    }
  }

  /**
   *
   * @param unidadeTipoAvaliacao
   */
  public changeUnidadeTipoAvaliacao(unidadeTipoAvaliacao) {

    // let avaliavel: Avaliavel = new Avaliavel();
    // avaliavel.usuario = this.usuario;
    // avaliavel.unidadeTipoAvaliacao = unidadeTipoAvaliacao;
    //
    // for (let i = 0; i < this.avaliaveis.length; i++) {
    //   if (this.avaliaveis[i].unidadeTipoAvaliacao.id === unidadeTipoAvaliacao.id) {
    //     avaliavel = this.avaliaveis[i];
    //   }
    // }
    //
    // avaliavel.ativo = (unidadeTipoAvaliacao as any).checked;
    //
    // if (!(unidadeTipoAvaliacao as any).checked) {
    //   //   this.removeAvaliavel.emit(avaliavel);
    //   // } else {
    //   //   this.saveAvaliavel.emit(avaliavel);
    // }
    //
    // this.unidadeTipoAvaliacaoDispositivoRepository.listByFilters({unidadeTipoAvaliacaoId: unidadeTipoAvaliacao.id}).subscribe(result => {
    //   unidadeTipoAvaliacao.unidadesTiposAvaliacoesDispositivo = result.content;
    //   console.log(unidadeTipoAvaliacao.unidadesTiposAvaliacoesDispositivo)
    // })
  }

  /**
   *
   * @param unidadeTipoAvaliacao
   * @param unidadeTipoAvaliacaoValue
   */
  public changeUnidadeTipoAvaliacaoUnidadeTipoAvaliacaoValue(unidadeTipoAvaliacao: UnidadeTipoAvaliacao, unidadeTipoAvaliacaoValue: boolean): [] {
    const toEmit: any = [];

    (unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoValue = unidadeTipoAvaliacaoValue;
    for (let c = 0; c < unidadeTipoAvaliacao.unidadesTiposAvaliacoesDispositivo.length; c++) {
      (unidadeTipoAvaliacao.unidadesTiposAvaliacoesDispositivo[c] as any).unidadeTipoAvaliacaoDispositivoValue = unidadeTipoAvaliacaoValue;
      toEmit.push(unidadeTipoAvaliacao.unidadesTiposAvaliacoesDispositivo[c])
    }

    return toEmit
  }

  /**
   *
   * @param toEmit
   */
  public emit(toEmit) {
    this.unidadesTiposAvaliacoesDispositivoChange.emit(toEmit)
  }

  /**
   *
   * @param unidade
   */
  public verifyUnidade(unidade: Unidade) {
    (unidade as any).avaliavelValue = unidade.unidadesTiposAvaliacoes.filter(u => (u as any).unidadeTipoAvaliacaoValue).length > 0;
  }

  /**
   *
   * @param unidade
   * @param avaliavelValue
   */
  public changeUnidadeAvaliavelValue(unidade: Unidade, avaliavelValue): [] {
    let toEmit: any = [];

    for (let k = 0; k < unidade.unidadesTiposAvaliacoes.length; k++) {
      (unidade.unidadesTiposAvaliacoes[k] as any).unidadeTipoAvaliacaoValue = avaliavelValue;
      toEmit = toEmit.concat(this.changeUnidadeTipoAvaliacaoUnidadeTipoAvaliacaoValue(unidade.unidadesTiposAvaliacoes[k], avaliavelValue));
    }

    return toEmit;
  }

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

  // /**
  //  *
  //  * @param {Unidade} unidade
  //  */
  // public listTiposAvaliacoesByUnidadeId(unidade) {
  //   this.unidadeTipoAvaliacaoRepository.listByFilters({unidadeId: unidade.id, ativo: true}).subscribe(page => {
  //
  //       const aux = unidade.unidadesTiposAvaliacoes;
  //
  //       unidade.unidadesTiposAvaliacoes = page.content;
  //
  //       if (aux && aux.length) {
  //         for (let i = 0; i < aux.length; i++) {
  //           for (let k = 0; k < unidade.unidadesTiposAvaliacoes.length; k++) {
  //             if (unidade.unidadesTiposAvaliacoes[k].tipoAvaliacao.id === aux[i].tipoAvaliacao.id) {
  //               if (!aux[i].avaliavel) {
  //                 aux[i].avaliavel = {}
  //               }
  //               unidade.unidadesTiposAvaliacoes[k].checked = aux[i].avaliavel.ativo;
  //               unidade.unidadesTiposAvaliacoes[k].avaliavel = aux[i].avaliavel
  //             }
  //           }
  //         }
  //       }
  //     }
  //   )
  // }

}
