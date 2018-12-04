import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Usuario} from '../entity/usuario/usuario.model';
import {FileRepository} from '../../infrastructure/repository/file/file.repository';
import {MatSnackBar} from '@angular/material';
import {UsuarioRepository} from '../repositories/usuario.repository';
import {FotoLoadingComponent} from '../presentation/controls/foto-loading/foto-loading.component';
import {environment} from "../../../environments/environment";

/**
 *
 */
@Injectable()
export class UsuarioService {

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {FileRepository} fileRepository
   * @param {UsuarioRepository} usuarioRepository
   */
  constructor(private snackBar: MatSnackBar,
              private fileRepository: FileRepository,
              private usuarioRepository: UsuarioRepository) {
  }

  /**
   *
   * @returns {Observable<Usuario[]>}
   */
  public find(): Observable<Usuario[]> {
    return this.usuarioRepository.findAll();
  }

  /**
   *
   * @param pageable
   * @returns {Observable<{}>}
   */
  public listByFilters(pageable: any): Observable<any> {
    return this.usuarioRepository.listByFilters(pageable);
  }

  /**
   *
   * @param pageable
   * @returns {Observable<{}>}
   */
  public listLightByFilters(pageable: any): Observable<any> {
    return this.usuarioRepository.listLightByFilters(pageable);
  }

  /**
   *
   * @param {number} id
   * @returns {Observable<Usuario>}
   */
  public findById(id: number): Observable<Usuario> {
    return this.usuarioRepository.findById(id);
  }


  /**
   *
   * @param {Usuario} usuario
   * @returns {Promise<Usuario>}
   */
  public save(usuario: Usuario): Promise<Usuario> {
    const arquivoFile = usuario.arquivoFile;
    const fotoPath = usuario.fotoPath;

    let toSave = usuario;
    delete toSave.arquivoFile;
    delete toSave.fotoPath;

    return new Promise((resolve, reject) => {
      if (arquivoFile)
        this.snackBar.openFromComponent(FotoLoadingComponent, {
          duration: 60000,
        });

      this.usuarioRepository.save(toSave)
        .then(result => {
          toSave = result;
          if (arquivoFile) {

            this.fileRepository.save(environment.endpoint + 'usuarios/' + String(result.id) + '/foto', arquivoFile)
              .then(uploaded => {
                toSave.fotoPath = uploaded;
                resolve(toSave);
              })
              .catch(error => {
                console.log(error);
                reject(error);
              });

          } else {

            if (!fotoPath) {
              this.fileRepository.remove(environment.endpoint + 'usuarios/' + String(result.id) + '/foto')
                .then(() => {
                  toSave.fotoPath = null;
                  resolve(toSave);
                })
                .catch(error => {
                  console.log(error);
                  reject(error);
                });
            }

            else resolve(result);

          }

        })

    });
  }

  /**
   *
   * @param {Usuario} usuario
   * @returns {Promise<{}>}
   */
  public remove(usuario: Usuario): Promise<any> {
    return this.usuarioRepository.delete(usuario.id);
  }

}
