import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {FileRepository} from '@src/sistema/infrastructure/repository/file/file.repository';
import {UsuarioRepository} from '@src/sistema/domain/repository/usuario.repository';
import {Usuario} from '@src/sistema/domain/entity/usuario/usuario.model';
import {FotoLoadingComponent} from '@src/sistema/application/presentation/controls/foto-loading/foto-loading.component';
import {environment} from '@src/environments/environment';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';

/**
 *
 */
@Injectable()
export class UsuarioService {

  /**
   *
   * @param {MatSnackBar} toastService
   * @param {FileRepository} fileRepository
   * @param {UsuarioRepository} usuarioRepository
   */
  constructor(private toastService: ToastService,
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
   * @param id
   * @param pageRequest
   */
  public findEstatisticasByUsuarioId(id: number, pageRequest: any): Observable<Usuario> {
    return this.usuarioRepository.findEstatisticasByUsuarioId(id, pageRequest);
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
      if (arquivoFile) {
        this.toastService.openFromComponent(FotoLoadingComponent, {
          duration: 60000,
        });
      }

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
            } else {
              resolve(result);
            }

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
