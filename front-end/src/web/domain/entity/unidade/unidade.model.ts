import {Endereco} from '../endereco/endereco.model';
import {Cidade} from '../endereco/cidade.model';
import {Rankeavel} from '../abstract/rankeavel.model';

export class Unidade extends Rankeavel {

  public cnpj: string;

  public endereco: Endereco;

  constructor() {
    super();
    this.endereco = new Endereco('', '', '', '', '', new Cidade(), 0, 0);
  }
}
