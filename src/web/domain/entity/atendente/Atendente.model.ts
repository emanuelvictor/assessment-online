import {Abstract} from '../abstract/Abstract.model';
import {Vinculo} from './Vinculo.enum';
import {Unidade} from '../unidade/Unidade.model';
import {Usuario} from '../usuario/Usuario.model';

export class Atendente extends Abstract {

  public unidade: Unidade;

  public colaborador: Usuario;

  public vinculo: Vinculo;

  constructor() {
    super();
    this.vinculo = Vinculo.Nenhum;
  }
}