
import {throwError as observableThrowError, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';



import {MatSnackBar} from "@angular/material";
import {Router} from '@angular/router';

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
   *
   * @param {MatSnackBar} snackBar
   * @param {Router} router
   */
  constructor(public snackBar: MatSnackBar, private router: Router) {
  }

  /**
   * Intercepta todas as requisições
   * @param {HttpRequest<>} req
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<>>}
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    /**
     * Inicia o progress
     */
    this.progress.start();

    /**
     * Finaliza o progress
     */
    return next.handle(req).do(this.progress.done()).catch(this.catchErrors());
  }

  /**
   * Função privada, captura os erros
   * @returns {(res: any) => ErrorObservable}
   */
  private catchErrors() {
    /**
     * Encerra progress
     */
    this.progress.done();

    return (res: any) => {

      if (res.status === 500) {
        this.error(res.error.message)
      }

      if (res.status === 504) {
        this.error(res.error.message)
      }

      if (res.status === 401 || res.status === 403) {
        this.error(res.error.message);
        // this.router.navigate(['authentication']);
      }

      return observableThrowError(res);
    };
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
}
