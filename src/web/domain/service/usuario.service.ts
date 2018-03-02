import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UsuarioRepository} from '../repository/usuario.repository';
import {AuthenticationService} from './authentication.service';
import {Usuario} from '../entity/usuario/Usuario.model';
import {FileRepository} from '../../infrastructure/repository/file/file.repository';
import {MatSnackBar} from '@angular/material';
import {FotoLoadingComponent} from '../presentation/controls/foto-loading/foto-loading.component';

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
  public save(usuario: Usuario): Promise<any> {

    const arquivoFile = usuario.arquivoFile;
    const urlFile = usuario.urlFile;

    const toSave = usuario;
    delete toSave.arquivoFile;
    delete  toSave.urlFile;

    return new Promise((resolve, reject) => {

      if (arquivoFile)
        this.snackBar.openFromComponent(FotoLoadingComponent, {
          duration: 60000,
        });

      this.usuarioRepository.saveWithAccount(toSave)
        .then(result => {

          if (arquivoFile) {

            this.fileRepository.save(result.key, arquivoFile)
              .then(uploaded => {
                toSave.urlFile = uploaded;
                this.usuarioRepository.saveWithAccount(toSave)
                  .then(usuarioAtualizado => {
                    resolve(usuarioAtualizado);
                  })
              });

          } else {

            if (!urlFile) {
              this.fileRepository.remove(result.key).then(result => {
                usuario.urlFile = null;
                this.usuarioRepository.saveWithAccount(usuario)
                  .then(resulted => {
                    resolve(resulted);
                  });
              });
            }

            else resolve(result);

          }

        });

    }).then(result => this.snackBar.dismiss());
  }

  /**
   *
   * @param usuario
   * @returns {Promise<any>}
   */
  public remove(usuario: Usuario): Promise<any> {
    return this.usuarioRepository.remove(usuario);
  }
}