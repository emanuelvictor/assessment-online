import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {Configuracao} from '@src/web/domain/entity/configuracao/configuracao.model';
import {viewAnimation} from '@src/web/domain/presentation/controls/utils';
import {MobileService} from '@src/mobile/domain/service/mobile.service';
import {Unidade} from '@src/web/domain/entity/unidade/unidade.model';

@Component({
  selector: 'selecionar-unidade',
  templateUrl: './selecionar-unidade.component.html',
  styleUrls: ['./selecionar-unidade.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class SelecionarUnidadeComponent implements OnInit, OnDestroy {

  /**
   *
   */
  configuracao: Configuracao;

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MobileService} mobileService
   */
  constructor(public mobileService: MobileService,
              private router: Router, private snackBar: MatSnackBar) {
  }

  /**
   *
   */
  async ngOnInit() {

    // Conecta o webscoket
    this.mobileService.connect();

    // Mata o timeout se houver (Aqui não precisa de timeout)
    this.mobileService.clearTimeout();

    // Registra o loading.
    this.mobileService.register('overlayStarSyntax');

    // Requisita configuração.
    this.configuracao = (await this.mobileService.getConfiguracaoAsync());

    // Se não tem unidades selecionadas, vai para tela de seleção de unidades
    if (!this.mobileService.dispositivo.unidades || !this.mobileService.dispositivo.unidades.length) {
      this.router.navigate(['error']);
      this.mobileService.resolve('overlayStarSyntax');
      return
    }

    // Se só tem uma unidade selecionada, passa direito e vai pra tela de avaliação
    if (this.mobileService.dispositivo.unidades.length === 1) {
      this.router.navigate(['avaliar/' + this.mobileService.dispositivo.numeroLicenca + '/' + this.mobileService.dispositivo.unidades[0].id + '/ordem/1']);
      this.mobileService.resolve('overlayStarSyntax');
      return
    }

    // Remove os itens selecionados da avaliação anterior
    this.mobileService.dispositivo.unidades.forEach(unidade => (unidade as any).selected = false);

    // Caso tenha unidades a selecionar, e a quantidade seja maior que 1
    // Remove loading
    this.mobileService.resolve('overlayStarSyntax')
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

  /**
   *
   */
  ngOnDestroy(): void {
    // Resolve o loading.
    this.mobileService.resolve('overlayStarSyntax')
  }
}
