import {Component, OnDestroy} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {AuthenticationService} from '../../../service/authentication.service';
import {ColaboradorService} from '../../../service/colaborador.service';
import {UsuarioService} from '../../../service/usuario.service';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  /**
   *
   */
  public usuario: any;

  /**
   *
   */
  public userSubscription: Subscription;

  /**
   *
   */
  public routerSubscription: Subscription;

  /**
   *
   * @param {AuthenticationService} authenticationService
   * @param {Router} router
   * @param {UsuarioService} usuarioService
   * @param {ColaboradorService} colaboradorService
   */
  constructor(private authenticationService: AuthenticationService, private router: Router, private colaboradorService: ColaboradorService) {
    this.authenticationService.getContaAutenticada().subscribe(result => {
      this.usuario = result;
      this.colaboradorService.listOperadoresByUsuarioKey(this.usuario.key).subscribe(operadores => {
        this.usuario.isOperador = operadores.length > 0;
        if (!this.usuario.isOperador && !this.usuario.isAdministrador)
          this.router.navigate(['/dashboard/minha-conta'])
      });
    });

    this.userSubscription = authenticationService.authenticatedUserChanged.subscribe((user) => {
      this.usuario = user;
    });
  }

  /**
   *
   */
  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
    if (this.routerSubscription) this.routerSubscription.unsubscribe();
  }

  /**
   *
   */
  public logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/authentication']);
  }

}
