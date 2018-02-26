import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UsuarioRepository} from '../repository/usuario.repository';
import {AuthenticationService} from './authentication.service';
import {Usuario} from '../entity/usuario/Usuario.model';
import {FileRepository} from '../repository/file.repository';
import {MatSnackBar} from '@angular/material';
import {FotoLoadingComponent} from '../../application/controls/foto-loading/foto-loading.component';

/**
 *
 */
@Injectable()
export class UsuarioService {
  /**
   *
   * @param {UsuarioRepository} usuarioRepository
   * @param {MatSnackBar} snackBar
   * @param {AuthenticationService} authenticationService TODO substituir por accountRepository
   * @param {FileRepository} fileRepository
   */
  constructor(private usuarioRepository: UsuarioRepository, private snackBar: MatSnackBar, private authenticationService: AuthenticationService, private fileRepository: FileRepository) {
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
   * TODO NORMALIZAAAAAAAAAAAAAAAARR
   *
   * @param {Usuario} usuario
   * @returns {PromiseLike<any>}
   */
  public save(usuario: Usuario): PromiseLike<any> {

    const file = usuario.arquivoFile;
    const toSave = usuario;
    delete toSave.password;
    delete toSave.arquivoFile;
    // toSave.urlFile = undefined;
    return new Promise((resolve) => {
      if (file)
        this.snackBar.openFromComponent(FotoLoadingComponent, {
          duration: 60000,
        });
      this.usuarioRepository.save(toSave)
        .then(result => {
          // this.authenticationService.save(usuario);
          if (file) {
            this.fileRepository.save(result.key, file)
              .then(uploaded => {
                result.urlFile = uploaded.downloadURL;
                this.usuarioRepository.save(result)
                  .then(usuarioAtualizado => {
                    this.snackBar.dismiss();
                    resolve(usuarioAtualizado);
                  })
              });
          } else {
            if (!usuario.urlFile) {
              this.fileRepository.remove(result.key);
              this.usuarioRepository.save(usuario).then(resulted => {
                resolve(result);
              });
            }
            resolve(result);
          }
        });
    });
  }

  /**
   *
   * @param {string} key
   * @returns {Promise<any>}
   */
  public remove(key: string): Promise<any> {
    return this.usuarioRepository.remove(key)
      .then(result => this.fileRepository.remove(key));
  }
}