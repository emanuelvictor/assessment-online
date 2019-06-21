import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Conta} from '../../../../../web/domain/entity/usuario/conta.model';
import {AuthenticationService} from '../../../../../web/domain/service/authentication.service';
import {UsuarioRepository} from "../../../../../web/domain/repository/usuario.repository";
import {LocalStorage} from "../../../../../web/infrastructure/local-storage/local-storage";

/**
 *
 */
@Component({
  selector: 'mobile-login',
  templateUrl: './mobile-login.component.html',
  styleUrls: ['./mobile-login.component.scss']
})
export class MobileLoginComponent {

  /**
   *
   */
  public conta: Conta = new Conta();

  /**
   *
   * @param {Router} router
   * @param localStorage
   * @param usuarioRepository
   * @param {} authenticationService
   */
  constructor(private router: Router,
              private localStorage: LocalStorage,
              private usuarioRepository: UsuarioRepository,
              private authenticationService: AuthenticationService) {
  }

  /**
   *
   */
  public login($event) {
    this.usuarioRepository.getSenhaByUsuarioId($event.usuario.id).subscribe( result => {
      this.localStorage.hashs = [result];
      this.router.navigate(['/'])
    })
  }
}
