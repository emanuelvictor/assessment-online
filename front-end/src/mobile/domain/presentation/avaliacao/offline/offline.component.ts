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
  tryAgain() {
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
   */
  logout() {
    (window.navigator as any).notification.prompt(
      'Insira uma senha administrativa para sair do aplicativo.',  // message
      (window as any).onPrompt,                  // callback to invoke
      'Sair do aplicativo',            // title
      ['Ok', 'Cancelar']              // buttonLabels
    )
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
