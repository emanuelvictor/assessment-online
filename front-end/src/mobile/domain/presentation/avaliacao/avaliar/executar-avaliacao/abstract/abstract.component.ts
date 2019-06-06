import {OnDestroy} from "@angular/core";
import {TdLoadingService} from "@covalent/core";
import {MobileService} from "../../../../../service/mobile.service";
import {MatSnackBar} from "@angular/material";
import {Configuracao} from "../../../../../../../web/domain/entity/configuracao/configuracao.model";

export abstract class AbstractComponent implements OnDestroy {


  /**
   *
   */
  protected configuracao: Configuracao;

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

    // Requisita configuração.
    this.mobileService.requestConfiguracao.then(result => {
      this.configuracao = result;

      // Entrei na view, requisitei a configuração, restarto o timeout
      this.restartTimeout(this.configuracao.time)
    })
  }


  /**
   *
   */
  protected restartTimeout(time?: number) {
    this.mobileService.restartTimeout(time)
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

  /**
   *
   */
  ngOnDestroy(): void {
    // Registra o loading.
    this._loadingService.resolve('overlayStarSyntax')
  }
}
