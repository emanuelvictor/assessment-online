import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../../../web/domain/service/authentication.service";
import {MatSnackBar} from "@angular/material";
import {LocalStorage} from "../../../../../web/infrastructure/local-storage/local-storage";
import {CookieService} from "ngx-cookie-service";
import {TOKEN_NAME} from "../../../../../web/domain/presentation/controls/utils";

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
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
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
        this.onPrompt,                  // callback to invoke
        'Sair do aplicativo',            // title
        ['Ok', 'Cancelar']              // buttonLabels
      );
    } else {
      this.innerLogout()
    }
  }

  removeHashs() {
    this.localStorage.removeHashs()
  }
  onPrompt(results) {
    if (results.buttonIndex === 2 || results.buttonIndex === 0){
      return;
    }

    window['plugins'].toast.showWithOptions(
      {
        message: "Saindo do aplicativo ... aguarde",
        duration: "long", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
        position: "bottom",
        addPixelsY: -40  // added a negative value to move it up a bit (default 0)
      }
    );

    const bcrypt = window['dcodeIO'].bcrypt;

    // var hash = '$2a$10$Ipj9ID5eqEUELkadTfVqm.2Z42AlAARdihUlQegDBaALlaCh8sqeq';

    // console.log(bcrypt.compareSync("123456", hash));

    const hashs = localStorage.hashs;

    for (let i = 0; i < hashs.length; i++) {
      if (bcrypt.compareSync(results.input1, hashs[i])) {
        this.innerLogout();
        return;
      }
    }

    window['plugins'].toast.showWithOptions(
      {
        message: "Senha incorreta",
        duration: "long", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
        position: "bottom",
        addPixelsY: -40  // added a negative value to move it up a bit (default 0)
      }
    );

  }

  innerLogout() {

    localStorage.removeItem(TOKEN_NAME);
    localStorage.removeItem('unidadeId');
    this.removeHashs();

    window['cookieEmperor'].clearAll(
      function () {
        window.location.href = 'file:///android_asset/www/index.html';
      },
      function () {
        console.log('Cookies could not be cleared');
      });

  }

}
