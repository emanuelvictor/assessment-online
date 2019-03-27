import {Observable, throwError as observableThrowError} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';


import {MatSnackBar} from "@angular/material";
import {Router} from "@angular/router";

/**
 *
 */
@Injectable()
export class Interceptor implements HttpInterceptor {

  /**
   * Instancia a partir do window o NProgress
   */
  progress = window['NProgress'];

  /**
   * @param router
   * @param snackBar
   */
  constructor(private router: Router, public snackBar: MatSnackBar) {
  }

  /**
   * Intercepta todas as requisições
   * @param {HttpRequest<>} req
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<>>}
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    /**
     * Finaliza o progress
     */
    return next.handle(req)
      .do(evt => {

        this.progress.start();

        if (evt instanceof HttpResponse)
          this.progress.done();

        else
          this.progress.inc(0.4);

      })
      .catch(this.catchErrors());
  }

  /**
   *
   * @param message
   */
  public error(message: string) {
    this.openSnackBar(message);
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
   * Função privada, captura os erros
   * @returns {(res: any) => ErrorObservable}
   */
  private catchErrors() {

    return (res: any) => {

      this.progress.done();

      if (res.status === 500) {
        this.error(res.error.message)
      }

      if (res.status === 504 || res.status === 408) {
        this.router.navigate(['offline']);
        this.error('Verifique sua conexão')
      }

      if (res.status === 401 || res.status === 403) {
        this.error(res.error.message);
        // this.router.navigate(['authentication']);
      }
console.log('res: ', res);
      return observableThrowError(res);

    };

  }

}
