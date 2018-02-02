import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UsuarioRepository} from '../repository/usuario.repository';

@Injectable()
export class UsuarioService {

  constructor(private usuarioRepository: UsuarioRepository) {
  }

  public find(): Observable<any[]> {
    return this.usuarioRepository.find();
  }

  public findOne(key: string): Observable<any> {
    return this.usuarioRepository.findOne(key);
  }

  public findUsuarioByEmail(email: string): Observable<any> {
    return this.usuarioRepository.findUsuarioByEmail(email);
  }

  public save(item: any): PromiseLike<any> {
    return this.usuarioRepository.save(item);
  }

  public remove(key: string): Promise<any> {
    return this.usuarioRepository.remove(key);
  }
}