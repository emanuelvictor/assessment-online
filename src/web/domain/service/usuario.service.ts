import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UsuarioRepository} from '../repository/usuario.repository';

@Injectable()
export class AtendenteService {

  constructor(private usuarioRepository: UsuarioRepository) {
  }

  public find(): Observable<any[]> {
    return this.usuarioRepository.find();
  }

  public findOne(key: string): Observable<any> {
    return this.usuarioRepository.findOne(key);
  }

  public save(item: any): PromiseLike<any> {
    return this.usuarioRepository.save(item);
  }

  public update(key: string, item: any): Promise<any> {
    return this.usuarioRepository.update(key, item);
  }

  public remove(key: string): Promise<any> {
    return this.usuarioRepository.remove(key);
  }
}