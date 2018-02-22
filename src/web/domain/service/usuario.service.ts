import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UsuarioRepository} from '../repository/usuario.repository';
import {AuthenticationService} from "./authentication.service";
import {Usuario} from "../entity/usuario/Usuario.model";
import {FileRepository} from "../repository/file.repository";

/**
 *
 */
@Injectable()
export class UsuarioService {
  /**
   *
   * @param {UsuarioRepository} usuarioRepository
   * @param {AuthenticationService} authenticationService TODO substituir por accountRepository
   */
  constructor(private usuarioRepository: UsuarioRepository, private authenticationService: AuthenticationService, private fileRepository: FileRepository) {
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
   * @param {Usuario} usuario
   * @returns {PromiseLike<any>}
   */
  public save(usuario: Usuario): PromiseLike<any> {
    console.log(usuario);
    this.fileRepository.save(usuario.key, usuario.foto)
      .then(result => console.log(result));

    const toSave = usuario;
    delete toSave.password;
    return this.usuarioRepository.save(toSave).then(result => {
      // this.authenticationService.save(usuario);
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