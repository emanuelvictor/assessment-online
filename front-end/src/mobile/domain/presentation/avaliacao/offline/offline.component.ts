import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../../../web/domain/service/authentication.service";
import {MatSnackBar} from "@angular/material";
import {LocalStorage} from "../../../../../web/infrastructure/local-storage/local-storage";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.css']
})
export class OfflineComponent {

  /**
   *
   * @param localStorage
   * @param cookieService
   * @param router
   * @param snackBar
   * @param authenticationService
   */
  constructor(private localStorage: LocalStorage,
              private cookieService: CookieService,
              private router: Router, public snackBar: MatSnackBar,
              private authenticationService: AuthenticationService) {

  }

  /**
   *
   */
  tryAgain() {
    this.authenticationService.onlineCheck()
      .then(result => {
        if (result) {
          this.router.navigate(['']);
        } else {
          this.openSnackBar('Sem conexão com a internet ainda')
        }
      })
      .catch(() => this.openSnackBar('Sem conexão com a internet ainda'));
  }

  /**
   *
   */
  logout() {
    if (this.localStorage.hashs.length) {
      (window.navigator as any).notification.prompt(
        'Insira uma senha administrativa para sair do aplicativo.',  // message
        (window as any).onPrompt,                  // callback to invoke
        'Sair do aplicativo',            // title
        ['Ok', 'Cancelar']              // buttonLabels
      );
    } else {
      this.getOut()
    }
  }

  getOut() {
    // Limpa o localstorage
    this.localStorage.clear();
    // Limpa os cookies
    this.cookieService.deleteAll();
    // Redireciona para tela de login
    this.router.navigate(['authentication'])
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
