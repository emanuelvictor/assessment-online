import {Abstract} from "../abstract/abstract.model";
import {Endereco} from "../endereco/endereco.model";
import {Licenca} from "../avaliacao/licenca.model";

export class Assinatura extends Abstract {

  /**
   *
   */
  public mesValidade: string;

  /**
   *
   */
  public anoValidade: string;

  /**
   *
   */
  public dataVencimento: any;

  /**
   *
   */
  public numeroCartao: any;

  /**
   *
   */
  public nomeTitularCartao: string;

  /**
   *
   */
  public souEmpresa: boolean;

  /**
   *
   */
  public documentoTitularCartao: string;

  /**
   *
   */
  public dataNascimentoTitularCartao: any;

  /**
   *
   */
  public codigoArea: string;

  /**
   *
   */
  public telefone: string;

  /**
   * TODO ?
   * Para pagamento com cartão de crédito
   */
  public hash: string;

  /**
   *
   */
  public endereco: Endereco;

  /**
   *
   */
  public licencas: Set<Licenca>;

}
