import {Cidade} from "./cidade.model";

export class Endereco {

  public logradouro: string;

  public complemento: string;

  public bairro: string;

  public cep: string;

  public numero: string;

  public cidade: Cidade;

  public latitude: number;

  public longitude: number;

  constructor(logradouro: string, complemento: string, bairro: string, cep: string, numero: string, cidade: Cidade, latitude: number, longitude: number) {
    this.logradouro = logradouro;
    this.complemento = complemento;
    this.bairro = bairro;
    this.cep = cep;
    this.numero = numero;
    this.cidade = cidade;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}