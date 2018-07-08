import {Injectable} from '@angular/core';
import {EnderecoRepository} from '../repositories/endereco.repository';

@Injectable()
export class EnderecoService {

  constructor(private enderecoRepository: EnderecoRepository) {
  }

  public getAdressByCep(cep: string): Promise<any> {
    return this.enderecoRepository.getAdressByCep(cep);
  }

  public find(cidade: string, uf: string): Promise<any> {
    return this.enderecoRepository.find(cidade, uf);
  }
}
