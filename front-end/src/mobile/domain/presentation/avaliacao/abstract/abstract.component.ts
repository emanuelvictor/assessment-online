import {OnDestroy} from "@angular/core";
import {TdLoadingService} from "@covalent/core";
import {MobileService} from "../../../service/mobile.service";
import {MatSnackBar} from "@angular/material";
import {Configuracao} from "../../../../../web/domain/entity/configuracao/configuracao.model";
import {ConfiguracaoRepository} from "../../../../../web/domain/repositories/configuracao.repository";

export abstract class AbstractComponent implements OnDestroy {


  /**
   *
   */
  public configuracao: Configuracao;

  /**
   * @param snackBar
   * @param mobileService
   * @param {TdLoadingService} _loadingService
   * @param configuracaoRepository
   */
  protected constructor(public snackBar: MatSnackBar,
                        public mobileService: MobileService,
                        public _loadingService: TdLoadingService,
                        public configuracaoRepository: ConfiguracaoRepository) {

    // Registra o loading.
    this._loadingService.register('overlayStarSyntax');

    // Entrei na view, restarto o timeout
    this.restartTimeout();

    // Requisita configuração.
    this.configuracaoRepository.requestConfiguracao.subscribe(result => this.configuracao = result)
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
