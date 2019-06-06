import {OnDestroy} from "@angular/core";
import {TdLoadingService} from "@covalent/core";
import {MobileService} from "../../../service/mobile.service";
import {MatSnackBar} from "@angular/material";

export abstract class AbstractComponent implements OnDestroy {

  /**
   * @param snackBar
   * @param mobileService
   * @param {TdLoadingService} _loadingService
   */
  protected constructor(public snackBar: MatSnackBar,
              public mobileService: MobileService,
              public _loadingService: TdLoadingService) {

    // Registra o loading.
    this._loadingService.register('overlayStarSyntax');

    // Entrei na view, restarto o timeout
    this.restartTimeout()
  }


  /**
   *
   */
  protected restartTimeout() {
    this.mobileService.restartTimeout()
  }

  /**
   *
   * @param message
   */
  protected openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    })
  }

  ngOnDestroy(): void {
    // Registra o loading.
    this._loadingService.resolve('overlayStarSyntax')
  }
}
