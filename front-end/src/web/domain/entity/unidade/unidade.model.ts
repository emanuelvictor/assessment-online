import {Endereco} from '../endereco/endereco.model';
import {Cidade} from '../endereco/cidade.model';
import {Pessoa} from '../abstract/pessoa.model';

export class Unidade extends Pessoa {

  public endereco: Endereco;

  private agradecimento: string;

  private unidadeSuperior: Unidade;

  /*-------------------------------------------------------------------
   * 		 				ATRIBUTOS DE DISPOSITIVO
   *-------------------------------------------------------------------*/
  private publico: boolean = false;

  private modoQuiosque: boolean = false;

  private modoInsonia: boolean;

  private time: number = 30;

  private quebrarLinhaNaSelecaoDeItemAvaliavel: boolean;

  constructor(id?: number) {
    super();
    this.id = id;
    this.endereco = new Endereco('', '', '', '', '', new Cidade(), 0, 0);
  }
}
