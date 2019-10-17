import {Abstract} from '../../abstract/abstract.model';
import {Unidade} from '../../unidade/unidade.model';
import {Usuario} from '../usuario.model';

export class Operador extends Abstract {

  public usuario: Usuario;

  public unidade: Unidade;

}
