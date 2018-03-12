import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UsuarioRepository} from '../repository/usuario.repository';
import {AuthenticationService} from './authentication.service';
import {Usuario} from '../entity/usuario/Usuario.model';
import {FileRepository} from '../../infrastructure/repository/file/file.repository';
import {MatSnackBar} from '@angular/material';
import {FotoLoadingComponent} from '../presentation/controls/foto-loading/foto-loading.component';
import {ColaboradorRepository} from "../repository/colaborador.repository";
import {AvaliacaoColaboradorRepository} from "../repository/avaliacao-colaborador.repository";

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
   * @param {ColaboradorRepository} colaboradorReposisotry
   * @param {AvaliacaoColaboradorRepository} avaliacaoColaboradorRepository
   */
  constructor(private usuarioRepository: UsuarioRepository, private snackBar: MatSnackBar,
              private authenticationService: AuthenticationService, private fileRepository: FileRepository,
              private colaboradorReposisotry: ColaboradorRepository, private avaliacaoColaboradorRepository: AvaliacaoColaboradorRepository) {
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

    const arquivoFile = usuario.arquivoFile;
    const urlFile = usuario.urlFile;

    const toSave = usuario;
    delete toSave.arquivoFile;
    delete  toSave.urlFile;

    return new Promise((resolve) => {
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
                    console.log(usuarioAtualizado);
                    resolve(usuarioAtualizado);
                  })
              });

          } else {

            if (!urlFile) {
              this.fileRepository.remove(result.key).then(result => {
                usuario.urlFile = null;
                this.usuarioRepository.saveWithAccount(usuario)
                  .then(resulted => {
                    console.log(resulted);
                    resolve(resulted);
                  });
              });
            }

            else resolve(result);

          }

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
    this.colaboradorReposisotry.listColaboradorByUsuarioKey(usuario.key).subscribe(colaboradores => {
      for (let k = 0; k < colaboradores.length; k++) {
        /**
         * Remove as avaliações do usuário
         */
        console.log(colaboradores[k].key);
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
    usuario.password = newPassword;
    return this.usuarioRepository.changePassword(usuario, newPassword);
  }

  /**
   *
   */
  public getUsuarioAutenticado(): Observable<Usuario> {
    return this.findUsuarioByEmail(this.authenticationService.getAuthenticatedUser().email);
  }
}