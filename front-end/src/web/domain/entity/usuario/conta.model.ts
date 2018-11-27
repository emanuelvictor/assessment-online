import {Usuario} from './usuario.model';
import {Abstract} from '../abstract/abstract.model';

export class Conta extends Abstract {

  public esquema: string;

  public administrador: boolean;

  public root: boolean;

  public email: string;

  public password: string;

  public lastLogin: Date;

  public usuario: Usuario;

  public isOperador: boolean;

  public isAdministrador: boolean;

}