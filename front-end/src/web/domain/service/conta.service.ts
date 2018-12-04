import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Usuario} from '../entity/usuario/usuario.model';
import {FileRepository} from '../../infrastructure/repository/file/file.repository';
import {ContaRepository} from '../repositories/conta.repository';
import {Conta} from '../entity/usuario/conta.model';
import {environment} from "../../../environments/environment";

/**
 *
 */
@Injectable()
export class ContaService {

  /**
   *
   * @param {ContaRepository} contaRepository
   * @param {FileRepository} fileRepository
   */
  constructor(private contaRepository: ContaRepository, private fileRepository: FileRepository,) {
  }

  /**
   *
   * @returns {Observable<any[]>}
   */
  public find(): Observable<Conta[]> {
    return this.contaRepository.findAll();
  }


  /**
   *
   * @param {number} id
   * @returns {Observable<Usuario>}
   */
  public findById(id: number): Observable<Conta> {
    return this.contaRepository.findById(id);
  }

  /**
   *
   * @param {Usuario} usuario
   * @param {string} newPassword
   * @returns {Promise<any>}
   */
  changePassword(usuario: Usuario, newPassword: string): Promise<any> {
    return this.contaRepository.changePassword(usuario, newPassword);
  }

  /**
   *
   * @param {Usuario} usuario
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<any>}
   */
  changeMyPassword(usuario: Usuario, currentPassword: string, newPassword: string): Promise<any> {
    return this.contaRepository.changeMyPassword(usuario, currentPassword, newPassword);
  }

  /**
   *
   * @param {Usuario} cliente
   */
  public createAccount(cliente: Usuario): Promise<Usuario> {

    const arquivoFile = cliente.arquivoFile;

    let toSave = cliente;
    delete toSave.arquivoFile;
    delete toSave.fotoPath;

    return new Promise((resolve, reject) => {

      this.contaRepository.createAccount(toSave)
        .then(result => {
          toSave = result;

          if (arquivoFile)
            this.fileRepository.save(environment.endpoint + 'usuarios/' + String(result.id) + '/foto', arquivoFile)
              .then(uploaded => {
                toSave.fotoPath = uploaded;
                resolve(toSave);
              })
              .catch(error => {
                console.error(error);
                reject(error);
              });


          else
            resolve(toSave);

        })
        .catch(error => {
          console.error(error);
          reject(error);
        });

    });

  }
}
