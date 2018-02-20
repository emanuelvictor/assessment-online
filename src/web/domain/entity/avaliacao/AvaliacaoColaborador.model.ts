import {Abstract} from '../abstract/Abstract.model';
import {Avaliacao} from "./Avaliacao.model";
import {Colaborador} from "../colaborador/Colaborador.model";

export class AvaliacaoColaborador extends Abstract {

  public colaborador: Colaborador;

  public avaliacao: Avaliacao;

}