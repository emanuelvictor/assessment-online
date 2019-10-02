import {Abstract} from '../abstract/abstract.model';
import {Avaliacao} from "./avaliacao.model";

export class Agrupador extends Abstract {

  public avaliacoes: Avaliacao[];

  public feedback: string;

  public siteKey: string;

  public recap: string;

  constructor() {
    super();
    this.avaliacoes = [];
  }
}
