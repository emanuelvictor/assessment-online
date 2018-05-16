import {Pais} from "./Pais.model";
import {Abstract} from '../abstract/Abstract.model';

export class Estado extends Abstract {

  public nome: string;

  public uf: string;

  public pais: Pais;

}
