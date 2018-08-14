import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AuthenticationService} from './authentication.service';
import {Usuario} from '../entity/usuario/usuario.model';
import {FileRepository} from '../../infrastructure/repository/file/file.repository';
import {MatSnackBar} from '@angular/material';
import {ColaboradorService} from './colaborador.service';
import {UsuarioRepository} from '../repositories/usuario.repository';
import {ColaboradorRepository} from '../repositories/colaborador.repository';
import {AvaliacaoColaboradorRepository} from '../repositories/avaliacao-colaborador.repository';
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
   * @param {AuthenticationService} authenticationService
   * @param {FileRepository} fileRepository
   * @param {ColaboradorService} colaboradorService
   * @param {ColaboradorRepository} colaboradorReposisotry
   * @param {AvaliacaoColaboradorRepository} avaliacaoColaboradorRepository
   */
  constructor(private authenticationService: AuthenticationService, private fileRepository: FileRepository,
              private usuarioRepository: UsuarioRepository, private snackBar: MatSnackBar, private colaboradorService: ColaboradorService,
              private colaboradorReposisotry: ColaboradorRepository, private avaliacaoColaboradorRepository: AvaliacaoColaboradorRepository) {
  }

  /**
   *
   * @returns {Observable<any[]>}
   */
  public find(): Observable<Usuario[]> {
    return this.usuarioRepository.findAll();

    // return Observable.save(observer => {
    //
    //   this.getContaAutenticada()
    //     .subscribe(usuarioAutenticado => {
    //
    //       if (usuarioAutenticado.isAdministrador) {
    //
    //         this.usuarioRepository.findById()
    //           .subscribe(atendentes => {
    //             observer.next(atendentes);
    //           })
    //
    //       } else {
    //
    //         this.listColaboradoresByOperadorKey(usuarioAutenticado.key)
    //           .subscribe(atendentes => {
    //             observer.next(atendentes);
    //           })
    //
    //       }
    //
    //     })
    //
    // })
  }

  /**
   * Lista todos os colaboradores do cooeprador
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listColaboradoresByOperadorKey(key: string): Observable<any> {

    return null;
    // let atendentesReturn = [];
    //
    // return this.colaboradorService.listOperadoresByUsuarioKey(key)
    //   .flatMap(colaboradores => {
    //     atendentesReturn = [];
    //     return colaboradores;
    //   })
    //   .flatMap((colaborador: Colaborador) => {
    //     atendentesReturn = [];
    //     return this.colaboradorService.listColaboradoresByUnidadeKey(colaborador.unidade.key)
    //   })
    //   .flatMap(colaboradores => {
    //     return colaboradores;
    //   })
    //   .flatMap((colaborador: Colaborador) => {
    //     return this.findOne(colaborador.usuario.key)
    //   })
    //   .map(atendente => {
    //
    //     let founded = false;
    //
    //     for (let i = 0; i < atendentesReturn.length; i++) {
    //       founded = atendentesReturn[i].key === atendente.key;
    //       if (founded) break
    //     }
    //
    //     if (!founded)
    //       atendentesReturn.push(atendente);
    //
    //     return atendentesReturn;
    //   })
  }

  /**
   * Lista todos os usuarios atendnetes do cooperador
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listAtendentesByOperadorKey(key: string): Observable<any> {

    return null;

    // let atendentesReturn = [];
    //
    // return this.colaboradorService.listOperadoresByUsuarioKey(key)
    //   .flatMap(colaboradores => {
    //     atendentesReturn = [];
    //     return colaboradores;
    //   })
    //   .flatMap((colaborador: Colaborador) => {
    //     atendentesReturn = [];
    //     return this.colaboradorService.listAtendentesByUnidadeKey(colaborador.unidade.key)
    //   })
    //   .flatMap(colaboradores => {
    //     return colaboradores;
    //   })
    //   .flatMap((colaborador: Colaborador) => {
    //     return this.findOne(colaborador.usuario.key)
    //   })
    //   .map(atendente => {
    //
    //     let founded = false;
    //
    //     for (let i = 0; i < atendentesReturn.length; i++) {
    //       founded = atendentesReturn[i].key === atendente.key;
    //       if (founded) break
    //     }
    //
    //     if (!founded)
    //       atendentesReturn.push(atendente);
    //
    //     return atendentesReturn;
    //   })
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
   * @returns {PromiseLike<any>}
   */
  public save(usuario: Usuario): Promise<any> {

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

            this.fileRepository.save('usuarios/' + String(result.id) + '/foto', arquivoFile)
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
              this.fileRepository.remove('usuarios/' + String(result.id) + '/foto')
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
        .catch(error => {
          console.log(error);
          reject(error);
        });

    });
  }

  /**
   *
   * @param usuario
   * @returns {Promise<any>}
   */
  public remove(usuario: Usuario): Promise<any> {

    /**
     * Remove os vínculos do usuário com as unidades
     */
    // this.colaboradorReposisotry.listColaboradoresByUsuarioKey(usuario.id).subscribe(colaboradores => {
    //   for (let k = 0; k < colaboradores.length; k++) {
    //     /**
    //      * Remove as avaliações do usuário
    //      */
    //     this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaboradores[k].key)
    //       .subscribe(avaliacoes => {
    //         for (let i = 0; i < avaliacoes.length; i++) {
    //           this.avaliacaoColaboradorRepository.remove(avaliacoes[i]);
    //         }
    //       });
    //     this.colaboradorReposisotry.remove(colaboradores[k]);
    //   }
    // });

    return this.usuarioRepository.delete(usuario.id);
  }


}
