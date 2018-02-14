import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UsuarioRepository} from '../repository/usuario.repository';
import {AuthenticationService} from "./authentication.service";
import {Usuario} from "../entity/usuario/Usuario.model";

/**
 *
 */
@Injectable()
export class UsuarioService {
  /**
   *
   * @param {UsuarioRepository} usuarioRepository
   * @param {AuthenticationService} authenticationService
   */
  constructor(private usuarioRepository: UsuarioRepository, private authenticationService: AuthenticationService) {
  }

  /**
   *
   * @returns {Observable<any[]>}
   */
  public find(): Observable<any[]> {
    return this.usuarioRepository.find();
  }

  /**
   *
   * @param {string} key
   * @returns {Observable<any>}
   */
  public findOne(key: string): Observable<any> {
    return this.usuarioRepository.findOne(key);
  }

  /**
   *
   * @param {string} email
   * @returns {Observable<any>}
   */
  public findUsuarioByEmail(email: string): Observable<any> {
    return this.usuarioRepository.findUsuarioByEmail(email);
  }

  /**
   *
   * @param {Usuario} item
   * @returns {PromiseLike<any>}
   */
  public save(item: Usuario): PromiseLike<any> {
    const toSave = item;
    delete toSave.password;
    return this.usuarioRepository.save(toSave).then(result=>{
      this.authenticationService.save(item)
    });
  }

  /**
   *
   * @param {string} key
   * @returns {Promise<any>}
   */
  public remove(key: string): Promise<any> {
    return this.usuarioRepository.remove(key);
  }
}