import {Pais} from "./pais.model";
import {Abstract} from '../abstract/abstract.model';

export class Estado extends Abstract {

  public nome: string;

  public uf: string;

  public pais: Pais;

}
