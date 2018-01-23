import {Estado} from "./Estado.model";
import {Abstract} from '../abstract/Abstract.model';

export class Cidade extends Abstract {

  public nome:string;

  public estado: Estado;
}