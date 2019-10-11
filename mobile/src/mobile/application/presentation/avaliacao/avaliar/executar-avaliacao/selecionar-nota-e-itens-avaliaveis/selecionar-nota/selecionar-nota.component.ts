import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {viewAnimation} from '@src/web/application/presentation/controls/utils';
import {UnidadeTipoAvaliacaoDispositivo} from '@src/web/domain/entity/avaliacao/unidade-tipo-avaliacao-dispositivo.model';
import {MobileService} from '@src/mobile/domain/service/mobile.service';
import {Agrupador} from '@src/web/domain/entity/avaliacao/agrupador.model';
import {Avaliacao} from '@src/web/domain/entity/avaliacao/avaliacao.model';

@Component({
  selector: 'selecionar-nota',
  templateUrl: './selecionar-nota.component.html',
  styleUrls: ['./selecionar-nota.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class SelecionarNotaComponent implements OnInit, OnDestroy {

  /**
   *
   * @type {UnidadeTipoAvaliacao}
   */
  unidadeTipoAvaliacaoDispositivo: UnidadeTipoAvaliacaoDispositivo = null;

  /**
   *
   */
  unidadesTiposAvaliacoesDispositivo: UnidadeTipoAvaliacaoDispositivo[];

  /**
   *
   */
  countTiposAvaliacoes: number;

  /**
   *
   * @param {Router} router
   * @param {MobileService} mobileService
   * @param {ActivatedRoute} activatedRoute
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   */
  constructor(public activatedRoute: ActivatedRoute,
              public mobileService: MobileService, private router: Router,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
  }

  /**
   *
   */
  ngOnInit() {

    // Registra o loading e restarta o timeout
    this.mobileService.register('overlayStarSyntax');
    this.mobileService.restartTimeout();

    // Se só tem uma unidade selecionada, e a ordem da avaliação é 1, então reseta o timeout.
    // Pois não há necessidade de zerá-lo, uma vez que não há mais de uma unidade para ser selecionada.
    // Isso auxilia na experiência de usuário, a tela não fica piscando
    if (this.mobileService.dispositivo.unidades.length === 1 && +this.activatedRoute.parent.snapshot.params.ordem === 1) {
      this.mobileService.clearTimeout()
    }

    // Se não tem avaliações, ou seja, deu F5, então vai pra tela inicial.
    if (!this.mobileService.agrupador.avaliacoes || (this.mobileService.agrupador.avaliacoes.length !== ((+this.activatedRoute.parent.snapshot.params.ordem) - 1))) {
      this.mobileService.agrupador = new Agrupador();
      this.router.navigate(['avaliar/' + this.mobileService.dispositivo.numeroLicenca])
    }

    // Se não tem unidades selecionadas vai para tela de selação de unidades
    if (!this.mobileService.dispositivo.unidades || !this.mobileService.dispositivo.unidades.length) {
      this.router.navigate(['configuracoes']);
      this.mobileService.resolve('overlayStarSyntax');
      return
    }

    // Popula variável de unidadesTiposAvalicoes, esta variável será utilizada na conclusão da avaliação.
    this.unidadesTiposAvaliacoesDispositivo = this.mobileService.dispositivo.unidadesTiposAvaliacoesDispositivo;

    // Se não tem unidades selecionadas vai para tela de selação de unidades
    if (!this.mobileService.dispositivo.unidadesTiposAvaliacoesDispositivo || !this.mobileService.dispositivo.unidadesTiposAvaliacoesDispositivo.length) {
      this.router.navigate(['configuracoes']);
      this.mobileService.resolve('overlayStarSyntax');
      return
    }

    // Se não tem unidadeId, então retorna para seleção de unidade.
    if (!this.activatedRoute.parent.snapshot.params.ordem) {
      this.router.navigate(['configuracoes']);
      this.mobileService.resolve('overlayStarSyntax');
      return
    }

    // Conta a quantidade de avaliações, utilizado para criar contador na tela.
    this.countTiposAvaliacoes = this.unidadesTiposAvaliacoesDispositivo.filter(unidadeTipoAvaliacaoDispositivo => unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.id === +this.activatedRoute.parent.parent.snapshot.params.unidadeId).length;

    // Se não está configurada a ordem, então volta para a tela inicial de configuração/seleção de unidades e tipos de avaliações vinculadas a essas.
    if (!this.activatedRoute.parent.parent.snapshot.params.unidadeId) {
      this.router.navigate(['avaliar/' + this.mobileService.dispositivo.numeroLicenca]);
      this.mobileService.resolve('overlayStarSyntax');
      return
    }

    // Pega a unidade filtrada pela ordem e pela unidade
    this.unidadeTipoAvaliacaoDispositivo = this.unidadesTiposAvaliacoesDispositivo.filter(unidadeTipoAvaliacaoDispositivo => {
      return unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.id === +this.activatedRoute.parent.parent.snapshot.params.unidadeId && unidadeTipoAvaliacaoDispositivo.ordem === +this.activatedRoute.parent.snapshot.params.ordem
    })[0];

    this.iconRegistry.addSvgIconInNamespace('assets', 'pessimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/pessimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'regular', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/regular.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'bom', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/bom.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'otimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/otimo.svg'));

    // Resolve o loading.
    this.mobileService.resolve('overlayStarSyntax');

  }

  /**
   *
   */
  public proximo(nota: number) {

    const avaliacao: Avaliacao = new Avaliacao();
    avaliacao.nota = nota;

    this.mobileService.agrupador.avaliacoes.push(avaliacao);

    this.router.navigate(['avaliar/' + this.mobileService.dispositivo.numeroLicenca + '/' + (+this.activatedRoute.parent.parent.snapshot.params.unidadeId) + '/ordem/' + this.activatedRoute.parent.snapshot.params.ordem + '/selecionar-atendentes']);

  }

  /**
   *
   */
  ngOnDestroy(): void {
    // Registra o loading.
    this.mobileService.resolve('overlayStarSyntax')
  }

}
