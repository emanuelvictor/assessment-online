import {Unidade} from '../unidade/Unidade.model';
import {Endereco} from '../endereco/Endereco.model';
import {Abstract} from '../abstract/Abstract.model';

export class Usuario extends Abstract {

  private _nome: string;

  private _isAdministrador: boolean;

  private _email: string = '';

  private _password: string = '';

  private _unidade: Unidade;

  private _endereco: Endereco;

  get nome(): string {
    return this._nome;
  }

  set nome(value: string) {
    this._nome = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get unidade(): Unidade {
    return this._unidade;
  }

  set unidade(value: Unidade) {
    this._unidade = value;
  }

  get endereco(): Endereco {
    return this._endereco;
  }

  set endereco(value: Endereco) {
    this._endereco = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }


  get isAdministrador(): boolean {
    return this._isAdministrador;
  }

  set isAdministrador(value: boolean) {
    this._isAdministrador = value;
  }
}