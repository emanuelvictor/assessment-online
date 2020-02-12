import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Usuario} from '@src/sistema/domain/entity/usuario/usuario.model';
import {Unidade} from '@src/sistema/domain/entity/unidade/unidade.model';
import {Operador} from '@src/sistema/domain/entity/usuario/vinculo/operador.model';
import {AvaliavelRepository} from '@src/sistema/domain/repository/avaliavel.repository';
import {UnidadeTipoAvaliacaoRepository} from '@src/sistema/domain/repository/unidade-tipo-avaliacao.repository';
import {UnidadeTipoAvaliacaoDispositivoRepository} from '@src/sistema/domain/repository/unidade-tipo-avaliacao-dispositivo.repository';
import {UnidadeTipoAvaliacao} from '@src/sistema/domain/entity/avaliacao/unidade-tipo-avaliacao.model';
import {UnidadeTipoAvaliacaoDispositivo} from '@src/sistema/domain/entity/avaliacao/unidade-tipo-avaliacao-dispositivo.model';

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
  public unidadesTiposAvaliacoesDispositivo: any;

  /**
   *
   * @type {EventEmitter}
   */
  @Output()
  public unidadesTiposAvaliacoesDispositivoChange = new EventEmitter();

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
   * @param unidadeTipoAvaliacao
   * @param unidadeTipoAvaliacaoValue
   */
  public static changeUnidadeTipoAvaliacaoUnidadeTipoAvaliacaoValue(unidadeTipoAvaliacao: UnidadeTipoAvaliacao, unidadeTipoAvaliacaoValue: boolean): UnidadeTipoAvaliacaoDispositivo[] {
    const toEmit: UnidadeTipoAvaliacaoDispositivo[] = [];

    (unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoValue = unidadeTipoAvaliacaoValue;
    for (let c = 0; c < unidadeTipoAvaliacao.unidadesTiposAvaliacoesDispositivo.length; c++) {
      (unidadeTipoAvaliacao.unidadesTiposAvaliacoesDispositivo[c] as any).unidadeTipoAvaliacaoDispositivoValue = unidadeTipoAvaliacaoValue;
      toEmit.push(unidadeTipoAvaliacao.unidadesTiposAvaliacoesDispositivo[c])
    }

    return toEmit
  }

  /**
   *
   * @param unidade
   * @param avaliavelValue
   */
  public static changeUnidadeAvaliavelValue(unidade: Unidade, avaliavelValue: boolean): [] {
    let toEmit: any = [];

    for (let k = 0; k < unidade.unidadesTiposAvaliacoes.length; k++) {
      (unidade.unidadesTiposAvaliacoes[k] as any).unidadeTipoAvaliacaoValue = avaliavelValue;
      toEmit = toEmit.concat(VincularUnidadeComponent.changeUnidadeTipoAvaliacaoUnidadeTipoAvaliacaoValue(unidade.unidadesTiposAvaliacoes[k], avaliavelValue));
    }

    return toEmit;
  }

  /**
   *
   * @param {Unidade} unidade
   * @param operadorValue
   */
  public saveOperadorInner(unidade: Unidade, operadorValue: boolean): void {
    if (!(unidade as any).operador) {
      const operador: Operador = new Operador();
      operador.usuario = this.usuario;

      const u = new Unidade();
      u.id = unidade.id;
      operador.unidade = u;
      (unidade as any).operador = operador;
    }

    if (!operadorValue) {
      this.removeOperador.emit((unidade as any).operador);
    } else {
      this.saveOperador.emit((unidade as any).operador)
    }
  }

  /**
   *
   * @param unidade
   * @param avaliavelValue
   */
  public changeAvaliavel(unidade, avaliavelValue: boolean) {
    if (avaliavelValue) {

      this.emit(VincularUnidadeComponent.changeUnidadeAvaliavelValue(unidade, avaliavelValue))

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
   * @param unidadeTipoAvaliacao
   */
  verifyUnidadeTipoAvaliacao(unidadeTipoAvaliacao: UnidadeTipoAvaliacao) {
    (unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoValue = unidadeTipoAvaliacao.unidadesTiposAvaliacoesDispositivo.filter(value => (value as any).unidadeTipoAvaliacaoDispositivoValue).length !== 0;
  }

  /**
   *
   * @param unidadeTipoAvaliacaoDispositivo
   * @param unidadeTipoAvaliacaoDispositivoValue
   */
  changeUnidadeTipoAvaliacaoDispositivoUnidadeTipoAvaliacaoDispositivoValue(unidadeTipoAvaliacaoDispositivo: UnidadeTipoAvaliacaoDispositivo, unidadeTipoAvaliacaoDispositivoValue: boolean) {
    const toEmit: any = [];
    (unidadeTipoAvaliacaoDispositivo as any).unidadeTipoAvaliacaoDispositivoValue = unidadeTipoAvaliacaoDispositivoValue;
    toEmit.push(unidadeTipoAvaliacaoDispositivo);
    return toEmit;
  }

  /**
   *
   * @param unidadeTipoAvaliacao
   */
  public clickUnidadeTipoAvaliacao(unidadeTipoAvaliacao: UnidadeTipoAvaliacao) {
    (unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoValue = (unidadeTipoAvaliacao.unidadesTiposAvaliacoesDispositivo.filter(value => (value as any).unidadeTipoAvaliacaoDispositivoValue).length >= 0 && unidadeTipoAvaliacao.unidadesTiposAvaliacoesDispositivo.filter(value => (value as any).unidadeTipoAvaliacaoDispositivoValue).length !== unidadeTipoAvaliacao.unidadesTiposAvaliacoesDispositivo.length);
    return VincularUnidadeComponent.changeUnidadeTipoAvaliacaoUnidadeTipoAvaliacaoValue(unidadeTipoAvaliacao, (unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoValue)
  }
}
