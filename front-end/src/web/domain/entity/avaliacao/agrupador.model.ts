import {Abstract} from '../abstract/abstract.model';
import {Avaliacao} from "./avaliacao.model";

export class Agrupador extends Abstract {

  public avaliacoes: Avaliacao[];

  public feedback: string;


  constructor() {
    super();
    this.avaliacoes = [];
  }
}
