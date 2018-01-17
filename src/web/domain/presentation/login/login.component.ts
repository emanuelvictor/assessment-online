import {Component} from "@angular/core";
import {MatSnackBar} from "@angular/material";
import 'rxjs/add/operator/toPromise';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";
import {Atendente} from "../../entity/atendente/atendente.model";

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
  public atendente: Atendente = new Atendente();

  /**
   *
   */
  constructor(public snackBar: MatSnackBar, private router: Router, private authenticationService: AuthenticationService) {
  }

  /**
   *
   */
  public login() {
    this.authenticationService.login(this.atendente).then(result => {
      this.router.navigate(['/']);
    });
  }
}
