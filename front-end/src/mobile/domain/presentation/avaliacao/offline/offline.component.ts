import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../../../web/domain/service/authentication.service";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.css']
})
export class OfflineComponent {

  /**
   *
   * @param router
   * @param snackBar
   * @param authenticationService
   */
  constructor(private router: Router,
              public snackBar: MatSnackBar,
              private authenticationService: AuthenticationService) {

  }

  /**
   *
   */
  clickHandler() {
    this.authenticationService.onlineCheck()
      .then(result => {
        if (result)
          this.router.navigate(['']);
        else
          this.openSnackBar('Sem conexão com a internet ainda')
      })
      .catch(() => this.openSnackBar('Sem conexão com a internet ainda'));
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }


}
