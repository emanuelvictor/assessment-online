import {Estado} from "./estado.model";
import {Abstract} from '../abstract/abstract.model';

export class Cidade extends Abstract {

  public nome:string;

  public estado: Estado = new Estado();
}