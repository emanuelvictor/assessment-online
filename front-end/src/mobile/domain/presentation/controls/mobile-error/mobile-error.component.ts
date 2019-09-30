import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material";
import {CookieService} from "ngx-cookie-service";
import {LocalStorage} from "../../../../../web/infrastructure/local-storage/local-storage";
import {MobileService} from "../../../service/mobile.service";

@Component({
  selector: 'mobile-error',
  templateUrl: './mobile-error.component.html',
  styleUrls: ['./mobile-error.component.css']
})
export class MobileErrorComponent implements OnInit, OnDestroy {

  /**
   *
   */
  private _timeout: number;

  /**
   *
   * @param _localStorage
   * @param cookieService
   * @param router
   * @param snackBar
   * @param mobileService
   */
  constructor(private _localStorage: LocalStorage,
              private cookieService: CookieService,
              private mobileService: MobileService,
              private router: Router, public snackBar: MatSnackBar) {

  }

  /**
   *
   */
  ngOnInit(): void {
    this._timeout = MobileService.setTimeout(() => {
      this.tryAgain();
      return 30000
    }, 30000);
  }

  /**
   *
   */
  tryAgain() {
    this.mobileService.onlineCheck().then(result => {
      if (result) {
        this.mobileService.requestDispositivoAutenticada().toPromise().then(dispositivoAutenticado => {
          if (dispositivoAutenticado) {
            this.mobileService.dispositivo = dispositivoAutenticado;
            this.router.navigate(['/avaliar/' + this.mobileService.dispositivo.numeroLicenca]);
          } else
            this.openSnackBar('Não conseguimos nos autenticar, tente sair da aplicação e entrar novamente')
        })
          .catch(() => this.openSnackBar('Não conseguimos nos autenticar, tente sair da aplicação e entrar novamente'))
      } else
        this.openSnackBar('Sem conexão com a internet ainda')
    })
      .catch(() => this.openSnackBar('Sem conexão com a internet ainda'));
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
  logout() {
    if (this._localStorage.senha)
      this.router.navigate(['/configuracoes/authenticate']);
    else
      this.router.navigate(['/configuracoes'])
  }

  /**
   *
   */
  ngOnDestroy(): void {
    clearTimeout(this._timeout)
  }
}
