import {Observable, throwError as observableThrowError} from 'rxjs';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Router} from '@angular/router';
import {environment} from '@src/environments/environment';
import {Injectable} from '@angular/core';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';
import {LocalStorage} from '@src/sistema/infrastructure/local-storage/local-storage';
import {MobileService} from '@src/mobile/domain/service/mobile.service';

/**
 *
 */
@Injectable()
export class MobileInterceptor implements HttpInterceptor {

  /**
   * Instancia a partir do window o NProgress
   */
  progress = window['NProgress'];

  /**
   *
   * @param router
   * @param toastService
   * @param localStorage
   * @param mobileService
   */
  constructor(private router: Router,
              private toastService: ToastService,
              private localStorage: LocalStorage,
              private mobileService: MobileService) {
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
      .catch(this.catchErrors())
  }

  /**
   *
   * @param message
   */
  public error(message: string) {
    this.openSnackBar(message)
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    return this.toastService.open(message, 'Fechar');
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
        // Execute the logout
        this.mobileService.logout(129000)
          .then( () => this.router.navigate(['configuracoes']));
      }// this.router.navigate(['authentication']);
      // Se é problema com a conexão ou eu estou no mobile
      else if (res.status === 504 || res.status === 408 || environment.mobile) {
        if (this.localStorage.token) {
          this.router.navigate(['error']);
          this.error('Verifique sua conexão')
        }
      }

      return observableThrowError(res)

    }

  }

}
