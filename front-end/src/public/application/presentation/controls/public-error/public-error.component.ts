import {Component, OnDestroy, OnInit} from '@angular/core';
import {MobileService} from '@src/mobile/domain/service/mobile.service';
import {PublicService} from '@src/public/domain/service/public.service';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';

@Component({
  selector: 'public-error',
  templateUrl: './public-error.component.html',
  styleUrls: ['./public-error.component.css']
})
export class PublicErrorComponent implements OnInit, OnDestroy {

  /**
   *
   */
  private _timeout: number;

  /**
   *
   * @param publicService
   * @param toastService
   */
  constructor(private publicService: PublicService, private toastService: ToastService) {
  }

  /**
   *
   */
  ngOnInit(): void {
    this._timeout = MobileService.setTimeout(() => {
      this.tryAgain();
      return 30000
    }, 30000)
  }

  /**
   *
   */
  tryAgain() {
    this.publicService.onlineCheck().then(result => {
      if (!result) {
        this.openSnackBar('Sem conexão com a internet ainda')
      }
    })
      .catch(() => this.openSnackBar('Sem conexão com a internet ainda'));
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.toastService.open(message, 'Fechar', {
      duration: 5000
    })
  }

  /**
   *
   */
  ngOnDestroy(): void {
    clearTimeout(this._timeout)
  }
}
