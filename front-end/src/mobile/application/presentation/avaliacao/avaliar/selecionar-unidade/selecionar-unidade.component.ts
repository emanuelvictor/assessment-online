import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Configuracao} from '@src/sistema/domain/entity/configuracao/configuracao.model';
import {viewAnimation} from '@src/sistema/application/presentation/controls/utils';
import {MobileService} from '@src/mobile/domain/service/mobile.service';
import {Unidade} from '@src/sistema/domain/entity/unidade/unidade.model';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';

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
   * @param {ToastService} toastService
   * @param {MobileService} mobileService
   */
  constructor(private router: Router,
              private toastService: ToastService,
              public mobileService: MobileService) {
  }

  /**
   *
   */
  async ngOnInit() {

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
      this.router.navigate(['avaliar/' + this.mobileService.dispositivo.id + '/' + this.mobileService.dispositivo.unidades[0].id + '/ordem/1']);
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
    this.router.navigate(['avaliar/' + this.mobileService.dispositivo.id + '/' + unidade.id + '/ordem/1'])
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
    // Resolve o loading.
    this.mobileService.resolve('overlayStarSyntax')
  }
}
