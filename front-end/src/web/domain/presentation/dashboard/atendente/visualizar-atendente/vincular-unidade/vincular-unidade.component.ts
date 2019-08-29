import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Usuario} from '../../../../../entity/usuario/usuario.model';
import {Unidade} from "../../../../../entity/unidade/unidade.model";
import {Operador} from "../../../../../entity/usuario/vinculo/operador.model";
import {AvaliavelRepository} from "../../../../../repository/avaliavel.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../repository/unidade-tipo-avaliacao.repository";
import {UnidadeTipoAvaliacaoLicencaRepository} from "../../../../../repository/unidade-tipo-avaliacao-licenca.repository";
import {UnidadeTipoAvaliacao} from "../../../../../entity/avaliacao/unidade-tipo-avaliacao.model";
import {UnidadeTipoAvaliacaoLicenca} from "../../../../../entity/avaliacao/unidade-tipo-avaliacao-licenca.model";

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
   * @param {AvaliavelRepository} avaliavelRepository
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   * @param unidadeTipoAvaliacaoLicencaRepository
   */
  constructor(private avaliavelRepository: AvaliavelRepository,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository,
              private unidadeTipoAvaliacaoLicencaRepository: UnidadeTipoAvaliacaoLicencaRepository) {
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

      this.emit(VincularUnidadeComponent.changeUnidadeAvaliavelValue(unidade, true))

    } else if (unidade.unidadesTiposAvaliacoes && unidade.unidadesTiposAvaliacoes.length) {

      let toEmit = [];

      for (let k = 0; k < unidade.unidadesTiposAvaliacoes.length; k++) {
        unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoValue = false;
        toEmit = toEmit.concat(VincularUnidadeComponent.changeUnidadeTipoAvaliacaoUnidadeTipoAvaliacaoValue(unidade.unidadesTiposAvaliacoes[k], unidade.unidadesTiposAvaliacoes[k].unidadeTipoAvaliacaoValue))
      }

      this.emit(toEmit);

      this.verifyUnidade(unidade)
    }
  }

  /**
   *
   * @param unidadeTipoAvaliacao
   * @param unidadeTipoAvaliacaoValue
   */
  public static changeUnidadeTipoAvaliacaoUnidadeTipoAvaliacaoValue(unidadeTipoAvaliacao: UnidadeTipoAvaliacao, unidadeTipoAvaliacaoValue: boolean): UnidadeTipoAvaliacaoLicenca[] {
    const toEmit: UnidadeTipoAvaliacaoLicenca[] = [];

    (unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoValue = unidadeTipoAvaliacaoValue;
    for (let c = 0; c < unidadeTipoAvaliacao.unidadesTiposAvaliacoesLicenca.length; c++) {
      (unidadeTipoAvaliacao.unidadesTiposAvaliacoesLicenca[c] as any).unidadeTipoAvaliacaoLicencaValue = unidadeTipoAvaliacaoValue;
      toEmit.push(unidadeTipoAvaliacao.unidadesTiposAvaliacoesLicenca[c])
    }

    return toEmit
  }

  /**
   *
   * @param toEmit
   */
  public emit(toEmit) {
    this.unidadesTiposAvaliacoesLicencaChange.emit(toEmit)
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
  public static changeUnidadeAvaliavelValue(unidade: Unidade, avaliavelValue): [] {
    let toEmit: any = [];

    for (let k = 0; k < unidade.unidadesTiposAvaliacoes.length; k++) {
      (unidade.unidadesTiposAvaliacoes[k] as any).unidadeTipoAvaliacaoValue = avaliavelValue;
      toEmit = toEmit.concat(VincularUnidadeComponent.changeUnidadeTipoAvaliacaoUnidadeTipoAvaliacaoValue(unidade.unidadesTiposAvaliacoes[k], avaliavelValue));
    }

    return toEmit;
  }

  /**
   *
   * @param unidadeTipoAvaliacao
   */
  verifyUnidadeTipoAvaliacao(unidadeTipoAvaliacao: UnidadeTipoAvaliacao) {
    (unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoValue = unidadeTipoAvaliacao.unidadesTiposAvaliacoesLicenca.filter(value => (value as any).unidadeTipoAvaliacaoLicencaValue).length !== 0;
  }

  /**
   *
   * @param unidadeTipoAvaliacaoLicenca
   * @param unidadeTipoAvaliacaoLicencaValue
   */
  changeUnidadeTipoAvaliacaoLicencaUnidadeTipoAvaliacaoLicencaValue(unidadeTipoAvaliacaoLicenca: UnidadeTipoAvaliacaoLicenca, unidadeTipoAvaliacaoLicencaValue: boolean) {
    const toEmit: any = [];
    (unidadeTipoAvaliacaoLicenca as any).unidadeTipoAvaliacaoLicencaValue = unidadeTipoAvaliacaoLicencaValue;
    toEmit.push(unidadeTipoAvaliacaoLicenca);
    return toEmit;
  }

  /**
   *
   * @param unidadeTipoAvaliacao
   */
  public clickUnidadeTipoAvaliacao(unidadeTipoAvaliacao: UnidadeTipoAvaliacao) {
    (unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoValue = (unidadeTipoAvaliacao.unidadesTiposAvaliacoesLicenca.filter(value => (value as any).unidadeTipoAvaliacaoLicencaValue).length >= 0 && unidadeTipoAvaliacao.unidadesTiposAvaliacoesLicenca.filter(value => (value as any).unidadeTipoAvaliacaoLicencaValue).length !== unidadeTipoAvaliacao.unidadesTiposAvaliacoesLicenca.length);
    return VincularUnidadeComponent.changeUnidadeTipoAvaliacaoUnidadeTipoAvaliacaoValue(unidadeTipoAvaliacao, (unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoValue)
  }
}
