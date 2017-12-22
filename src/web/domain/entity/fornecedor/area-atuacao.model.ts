import {Usuario} from "../usuario/usuario.model";

export class AreaAtuacao {
  public id: number;

  public checked: boolean = true;

  public tipoResiduo: string;

  public fornecedor: Usuario = null;

  public quantidade: number;
}