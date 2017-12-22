import {Component} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {MatSnackBar} from "@angular/material";
import 'rxjs/add/operator/toPromise';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";
import {Usuario} from "../../entity/usuario/usuario.model";


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
   *
   * @param body
   * @returns {Promise<T>}
   */
  public login() {
    this.authenticationService.login(this.usuario).then(result => {
      this.authenticationService.getPromiseAuthenticatedUser().then(authenticated => {
        this.usuario = authenticated;
        this.authenticationService.setAuthenticatedUser(this.usuario);
        this.router.navigate(['/']);
      });
    });
  }
}
