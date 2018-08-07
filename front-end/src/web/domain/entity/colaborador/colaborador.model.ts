import {Abstract} from '../abstract/abstract.model';
import {Vinculo} from './vinculo.enum';
import {Unidade} from '../unidade/unidade.model';
import {Usuario} from '../usuario/usuario.model';

export class Colaborador extends Abstract {

  public unidade: Unidade;

  public usuario: Usuario;

  public vinculo: Vinculo;

  constructor() {
    super();
    this.vinculo = Vinculo.Nenhum;
  }
}
