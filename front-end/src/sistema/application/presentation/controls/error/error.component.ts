import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {CookieService} from 'ngx-cookie-service';
import {AuthenticationService} from '../../../../domain/service/authentication.service';
import {LocalStorage} from '../../../../infrastructure/local-storage/local-storage';

@Component({
  selector: 'error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {

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
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    })
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
    if (window.localStorage.getItem('unidadeId')) {
      (window.navigator as any).notification.prompt(
        'Insira uma senha administrativa para sair do aplicativo.',  // message
        onPrompt,                  // callback to invoke
        'Sair do aplicativo',            // title
        ['Ok', 'Cancelar']              // buttonLabels
      );
    } else {
      innerLogout()
    }
  }

}

export function innerLogout() {

  localStorage.clear();

  window['cookieEmperor'].clearAll(
    function () {
      window.location.href = 'file:///android_asset/www/index.html'
    },
    function () {
      console.log('Cookies could not be cleared')
    })

}

export function getHashs() {
  const hashs = [];

  for (let _i = 0; _i < window.localStorage['hashs.length']; _i++) {
    hashs.push(window.localStorage[_i])
  }

  return hashs
}

export function onPrompt(results) {

  if (results.buttonIndex === 2 || results.buttonIndex === 0) {
    return;
  }

  window['plugins'].toast.showWithOptions(
    {
      message: 'Saindo do aplicativo ... aguarde',
      duration: 'long', // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
      position: 'bottom',
      addPixelsY: -40  // added a negative value to move it up a bit (default 0)
    }
  );

  const bcrypt = window['dcodeIO'].bcrypt;

  // var hash = '$2a$10$Ipj9ID5eqEUELkadTfVqm.2Z42AlAARdihUlQegDBaALlaCh8sqeq';

  // console.log(bcrypt.compareSync("123456", hash));

  const hashs = getHashs();

  for (let i = 0; i < hashs.length; i++) {
    if (bcrypt.compareSync(results.input1, hashs[i])) {
      innerLogout();
      return
    }
  }

  window['plugins'].toast.showWithOptions(
    {
      message: 'Senha incorreta',
      duration: 'long', // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
      position: 'bottom',
      addPixelsY: -40  // added a negative value to move it up a bit (default 0)
    }
  )

}
