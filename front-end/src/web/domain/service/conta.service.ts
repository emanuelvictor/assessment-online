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
import {ContaRepository} from '../repositories/conta.repository';
import {Conta} from '../entity/usuario/conta.model';

/**
 *
 */
@Injectable()
export class ContaService {

  /**
   *
   * @param {UsuarioRepository} contaRepository
   */
  constructor(private contaRepository: ContaRepository) {
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
   * @param {string} email
   * @returns {Observable<any>}
   */
  public findUsuarioByEmail(email: string): Observable<any> {
    return this.contaRepository.findUsuarioByEmail(email);
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


}
