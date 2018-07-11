import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw'
import {MatSnackBar} from "@angular/material";

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
   * @param {MatSnackBar} snackBar
   */
  constructor(public snackBar: MatSnackBar) {
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
      console.log(res);
      if (res.status === 500) {
        this.error(res.error.message)
      }

      if (res.status === 504) {
        this.error(res.error.message)
      }

      if (res.status === 401 || res.status === 403) {
        //handle authorization errors
        //in this example I am navigating to logout route which brings the login screen
        // this.router.navigate(['logout']);
      }

      return Observable.throw(res);
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