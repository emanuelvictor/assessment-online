import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';
import {Usuario} from '../../entity/usuario/Usuario.model';

/**
 *
 */
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  /**
   *
   */
  public usuario: Usuario = new Usuario();

  /**
   *
   */
  constructor(public snackBar: MatSnackBar, private router: Router, private authenticationService: AuthenticationService) {
  }

  /**
   */
  public login() {
    this.authenticationService.login(this.usuario).then(result => {
      this.router.navigate(['/']);
    }).catch( exception => this.snackBar.open('Login ou senha não coincidem!', 'Fechar'));
  }
}
