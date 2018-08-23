import {Endereco} from '../endereco/endereco.model';
import {Cidade} from '../endereco/cidade.model';
import {Pessoa} from '../abstract/pessoa.model';

export class Unidade extends Pessoa {

  public endereco: Endereco;

  constructor() {
    super();
    this.endereco = new Endereco('', '', '', '', '', new Cidade(), 0, 0);
  }
}
