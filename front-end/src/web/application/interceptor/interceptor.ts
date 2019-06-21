import {Observable, throwError as observableThrowError} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';


import {MatSnackBar} from "@angular/material";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {LocalStorage} from "../../infrastructure/local-storage/local-storage";

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
   * @param router
   * @param snackBar
   * @param localStorage
   */
  constructor(private router: Router,
              public snackBar: MatSnackBar,
              private localStorage: LocalStorage) {
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

        if (evt instanceof HttpResponse) {
          this.progress.done();
        } else {
          this.progress.inc(0.4);
        }

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
      } else if (res.status === 401 || res.status === 403) {
        this.error(res.error.message);
      }// this.router.navigate(['authentication']);
      // Se é problema com a conexão ou eu estou no mobile
      else if (res.status === 504 || res.status === 408 || environment.mobile) {
        if (this.localStorage.token) {
          this.router.navigate(['error']);
          this.error('Verifique sua conexão')
        }
      }

      return observableThrowError(res);

    };

  }

}
