import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {MobileService} from '@src/mobile/domain/service/mobile.service';
import {PublicService} from '@src/public/domain/service/public.service';

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
   * @param snackBar
   */
  constructor(private publicService: PublicService, private snackBar: MatSnackBar) {
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
    this.snackBar.open(message, 'Fechar', {
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
