import {Abstract} from '../abstract/Abstract.model';
import {Vinculo} from './Vinculo.enum';

export class Atendente extends Abstract {

  private _vinculo: Vinculo;

  private _isAtivo: boolean;

  get vinculo(): Vinculo {
    return this._vinculo;
  }

  set vinculo(value: Vinculo) {
    this._vinculo = value;
  }

  get isAtivo(): boolean {
    return this._isAtivo;
  }

  set isAtivo(value: boolean) {
    this._isAtivo = value;
  }
}