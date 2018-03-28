import {Endereco} from '../endereco/Endereco.model';
import {Cidade} from '../endereco/Cidade.model';
import {Rankeavel} from '../abstract/Rankeavel.model';

export class Unidade extends Rankeavel {

  public nome: string;

  public endereco: Endereco;

  constructor() {
    super();
    this.endereco = new Endereco('', '', '', '', '', new Cidade(), 0, 0);
  }
}