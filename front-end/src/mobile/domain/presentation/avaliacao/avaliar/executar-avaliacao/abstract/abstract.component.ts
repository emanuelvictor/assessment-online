import {OnDestroy} from "@angular/core";
import {MobileService} from "../../../../../service/mobile.service";
import {MatSnackBar} from "@angular/material";
import {Configuracao} from "../../../../../../../web/domain/entity/configuracao/configuracao.model";

export abstract class AbstractComponent implements OnDestroy {

  /**
   *
   */
  public configuracao: Configuracao;

  /**
   * @param snackBar
   * @param mobileService
   */
  protected constructor(public snackBar: MatSnackBar, public mobileService: MobileService) {

    // Registra o loading.
    this.mobileService.register('overlayStarSyntax');

    // Requisita configuração.
    this.mobileService.requestConfiguracao.then(result => {
      this.configuracao = result;

      // Entrei na view, requisitei a configuração, restarto o timeout
      this.restartTimeout(this.configuracao.timeInMilis ? this.configuracao.timeInMilis : 30000)
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
   */
  ngOnDestroy(): void {
    // Registra o loading.
    this.mobileService.resolve('overlayStarSyntax')
  }
}
