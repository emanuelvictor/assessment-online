import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UsuarioRepository} from '../repository/usuario.repository';
import {AuthenticationService} from './authentication.service';
import {Usuario} from '../entity/usuario/Usuario.model';
import {FileRepository} from '../../infrastructure/repository/file/file.repository';
import {MatSnackBar} from '@angular/material';
import {FotoLoadingComponent} from '../presentation/controls/foto-loading/foto-loading.component';
import {ColaboradorRepository} from '../repository/colaborador.repository';
import {AvaliacaoColaboradorRepository} from '../repository/avaliacao-colaborador.repository';
import {ColaboradorService} from './colaborador.service';
import {Colaborador} from '../entity/colaborador/Colaborador.model';

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
  constructor(private usuarioRepository: UsuarioRepository, private snackBar: MatSnackBar,
              private authenticationService: AuthenticationService, private fileRepository: FileRepository,
              private colaboradorService: ColaboradorService,
              private colaboradorReposisotry: ColaboradorRepository, private avaliacaoColaboradorRepository: AvaliacaoColaboradorRepository) {
  }

  /**
   *
   * @returns {Observable<any[]>}
   */
  public find(): Promise<any[]> {
    return this.usuarioRepository.findAll();

    // return Observable.create(observer => {
    //
    //   this.getUsuarioAutenticado()
    //     .subscribe(usuarioAutenticado => {
    //
    //       if (usuarioAutenticado.isAdministrador) {
    //
    //         this.usuarioRepository.find()
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

    let atendentesReturn = [];

    return this.colaboradorService.listOperadoresByUsuarioKey(key)
      .flatMap(colaboradores => {
        atendentesReturn = [];
        return colaboradores;
      })
      .flatMap((colaborador: Colaborador) => {
        atendentesReturn = [];
        return this.colaboradorService.listColaboradoresByUnidadeKey(colaborador.unidade.key)
      })
      .flatMap(colaboradores => {
        return colaboradores;
      })
      .flatMap((colaborador: Colaborador) => {
        return this.findOne(colaborador.usuario.key)
      })
      .map(atendente => {

        let founded = false;

        for (let i = 0; i < atendentesReturn.length; i++) {
          founded = atendentesReturn[i].key === atendente.key;
          if (founded) break
        }

        if (!founded)
          atendentesReturn.push(atendente);

        return atendentesReturn;
      })
  }

  /**
   * Lista todos os usuarios atendnetes do cooperador
   * @param {string} key
   * @returns {Observable<any>}
   */
  public listAtendentesByOperadorKey(key: string): Observable<any> {

    let atendentesReturn = [];

    return this.colaboradorService.listOperadoresByUsuarioKey(key)
      .flatMap(colaboradores => {
        atendentesReturn = [];
        return colaboradores;
      })
      .flatMap((colaborador: Colaborador) => {
        atendentesReturn = [];
        return this.colaboradorService.listAtendentesByUnidadeKey(colaborador.unidade.key)
      })
      .flatMap(colaboradores => {
        return colaboradores;
      })
      .flatMap((colaborador: Colaborador) => {
        return this.findOne(colaborador.usuario.key)
      })
      .map(atendente => {

        let founded = false;

        for (let i = 0; i < atendentesReturn.length; i++) {
          founded = atendentesReturn[i].key === atendente.key;
          if (founded) break
        }

        if (!founded)
          atendentesReturn.push(atendente);

        return atendentesReturn;
      })
  }

  /**
   *
   * @param {string} key
   * @returns {Observable<any>}
   */
  public findOne(key: string): Observable<Usuario> {
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

    return this.usuarioRepository.save(usuario);


    // const arquivoFile = usuario.arquivoFile;
    // const urlFile = usuario.urlFile;
    //
    // const toSave = usuario;
    // delete toSave.arquivoFile;
    // delete  toSave.urlFile;
    //
    // return new Promise((resolve) => {
    //   if (arquivoFile)
    //     this.snackBar.openFromComponent(FotoLoadingComponent, {
    //       duration: 60000,
    //     });
    //
    //   this.usuarioRepository.saveWithAccount(toSave)
    //     .then(result => {
    //
    //       if (arquivoFile) {
    //
    //         this.fileRepository.save(result.key, arquivoFile)
    //           .then(uploaded => {
    //             toSave.urlFile = uploaded;
    //             this.usuarioRepository.saveWithAccount(toSave)
    //               .then(usuarioAtualizado => {
    //                 resolve(usuarioAtualizado);
    //               })
    //           });
    //
    //       } else {
    //
    //         if (!urlFile) {
    //           this.fileRepository.remove(result.key)
    //             .then(result => {
    //               usuario.urlFile = null;
    //               this.usuarioRepository.saveWithAccount(usuario)
    //                 .then(resulted => {
    //                   resolve(resulted);
    //                 });
    //             });
    //         }
    //
    //         else resolve(result);
    //
    //       }
    //
    //     });
    //
    // });
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
    this.colaboradorReposisotry.listColaboradoresByUsuarioKey(usuario.key).subscribe(colaboradores => {
      for (let k = 0; k < colaboradores.length; k++) {
        /**
         * Remove as avaliações do usuário
         */
        this.avaliacaoColaboradorRepository.listAvaliacoesColaboradoresByColaboradorKey(colaboradores[k].key)
          .subscribe(avaliacoes => {
            for (let i = 0; i < avaliacoes.length; i++) {
              this.avaliacaoColaboradorRepository.remove(avaliacoes[i]);
            }
          });
        this.colaboradorReposisotry.remove(colaboradores[k]);
      }
    });

    return this.usuarioRepository.remove(usuario);
  }

  /**
   *
   * @param {Usuario} usuario
   * @param {string} newPassword
   * @returns {Promise<any>}
   */
  changePassword(usuario: Usuario, newPassword: string): Promise<any> {
    return this.usuarioRepository.changePassword(usuario, newPassword);
  }

  /**
   *
   * @param {Usuario} usuario
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<any>}
   */
  changeMyPassword(usuario: Usuario, currentPassword: string, newPassword: string): Promise<any> {
    return this.usuarioRepository.changeMyPassword(usuario, currentPassword, newPassword);
  }

  /**
   *
   */
  public getUsuarioAutenticado(): Observable<any> {
    return this.findUsuarioByEmail(this.authenticationService.getAuthenticatedUser().email);
  }
}