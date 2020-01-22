import {Endereco} from '../endereco/endereco.model';
import {Cidade} from '../endereco/cidade.model';
import {Pessoa} from '../abstract/pessoa.model';
import {UnidadeTipoAvaliacao} from '../avaliacao/unidade-tipo-avaliacao.model';

export class Unidade extends Pessoa {

  public endereco: Endereco;

  public unidadesTiposAvaliacoes: UnidadeTipoAvaliacao[];

  constructor(id?: number) {
    super();
    this.id = id;
    this.endereco = new Endereco('', '', '', '', '', new Cidade(), 0, 0);
  }
}