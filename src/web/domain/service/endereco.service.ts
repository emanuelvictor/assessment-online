import {Injectable} from '@angular/core';
import {EnderecoRepository} from '../repository/endereco.repository';

@Injectable()
export class EnderecoService {


  constructor(private enderecoRepository: EnderecoRepository) {
  }

  public getAdressByCep(cep: string): Promise<any> {
    return this.enderecoRepository.getAdressByCep(cep);
  }

  public getEstados(): Promise<any> {
    return this.enderecoRepository.getEstados()
  }

  public getCidadeByEstadoId(estadoId: number): Promise<any> {
    return this.enderecoRepository.getCidadeByEstadoId(estadoId);
  }
}
