import {Usuario} from './usuario.model';
import {Abstract} from '../abstract/Abstract.model';

export class Conta extends Abstract{

  public esquema: string;

  public email: string;

  public password: string;

  public lastLogin: Date;

  public usuario: Usuario;
}