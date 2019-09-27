import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MobileService} from '../../../../service/mobile.service';
import {MatSnackBar} from "@angular/material";
import {Configuracao} from "../../../../../../web/domain/entity/configuracao/configuracao.model";
import {TdLoadingService} from "@covalent/core";
import {Unidade} from "../../../../../../web/domain/entity/unidade/unidade.model";
import {viewAnimation} from "../../../../../../web/domain/presentation/controls/utils";

@Component({
  selector: 'selecionar-unidade',
  templateUrl: './selecionar-unidade.component.html',
  styleUrls: ['./selecionar-unidade.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class SelecionarUnidadeComponent implements OnInit {

  /**
   *
   */
  configuracao: Configuracao;

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MobileService} mobileService
   * @param _loadingService
   */
  constructor(private mobileService: MobileService,
              private _loadingService: TdLoadingService,
              private router: Router, private snackBar: MatSnackBar) {
  }

  /**
   *
   */
  ngOnInit() {

    // Mata o timeout se houver (Aqui não precisa de timeout)
    this.mobileService.clearTimeout();

    // Registra o loading.
    this._loadingService.register('overlayStarSyntax');

    // Requisita configuração.
    this.mobileService.requestConfiguracao.then(configuracao => {
      this.configuracao = configuracao;

      // Se não tem unidades selecionadas, vai para tela de seleção de unidades
      if (!this.mobileService.dispositivo.unidades || !this.mobileService.dispositivo.unidades.length) {
        this.router.navigate(['configuracoes/error']);
        this._loadingService.resolve('overlayStarSyntax');
        return
      }

      // Se só tem uma unidade selecionada, passa direito e vai pra tela de avaliação
      if (this.mobileService.dispositivo.unidades.length === 1) {
        this.router.navigate(['avaliar/' + this.mobileService.dispositivo.numeroLicenca + '/' + this.mobileService.dispositivo.unidades[0].id + '/ordem/1']);
        this._loadingService.resolve('overlayStarSyntax');
        return
      }

      // Remove os itens selecionados da avaliação anterior
      this.mobileService.dispositivo.unidades.forEach( unidade => (unidade as any).selected = false);

      // Caso tenha unidades a selecionar, e a quantidade seja maior que 1
      // Remove loading
      this._loadingService.resolve('overlayStarSyntax')
    })
  }

  /**
   *
   * @param unidade
   */
  public proximo(unidade: Unidade) {
    this.router.navigate(['avaliar/' + this.mobileService.dispositivo.numeroLicenca + '/' + unidade.id + '/ordem/1'])
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

}
