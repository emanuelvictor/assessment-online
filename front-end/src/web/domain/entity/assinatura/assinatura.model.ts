import {Abstract} from "../abstract/abstract.model";
import {Endereco} from "../endereco/endereco.model";
import {Licenca} from "../avaliacao/licenca.model";
import {Plano} from "./plano.model";
import {Cidade} from "../endereco/cidade.model";

export class Assinatura extends Abstract {

  /**
   *
   */
  public formaPagamento: any;

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

  /**
   *
   */
  public codigoSeguranca: any;

  /**
   *
   */
  public plano: Plano;

  /**
   *
   */
  constructor() {
    super();
    this.formaPagamento = 'BOLETO';
    this.endereco = new Endereco('', '', '', '', '', new Cidade(), 0, 0)
  }
}
