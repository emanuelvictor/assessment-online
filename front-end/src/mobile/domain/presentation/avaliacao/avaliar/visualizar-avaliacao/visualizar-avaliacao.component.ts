import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Configuracao} from "../../../../../../web/domain/entity/configuracao/configuracao.model";
import {MobileService} from "../../../../service/mobile.service";
import {ConfiguracaoService} from "../../../../../../web/domain/service/configuracao.service";
import {AuthenticationService} from "../../../../../../web/domain/service/authentication.service";
import {MatIconRegistry, MatSnackBar} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {UnidadeTipoAvaliacao} from "../../../../../../web/domain/entity/avaliacao/unidade-tipo-avaliacao.model";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../../web/domain/repositories/unidade-tipo-avaliacao.repository";
import {AvaliavelRepository} from "../../../../../../web/domain/repositories/avaliavel.repository";

@Component({
  selector: 'visualizar-avaliacao',
  templateUrl: './visualizar-avaliacao.component.html',
  styleUrls: ['./visualizar-avaliacao.component.scss']
})
export class VisualizarAvaliacaoComponent implements OnInit {

  /**
   *
   * @type {Configuracao}
   */
  configuracao: Configuracao;

  /**
   *
   * @type {UnidadeTipoAvaliacao}
   */
  unidadeTipoAvaliacao: UnidadeTipoAvaliacao = null;

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MobileService} mobileService
   * @param {ActivatedRoute} activatedRoute
   * @param {ConfiguracaoService} configuracaoService
   * @param {AvaliavelRepository} avaliavelRepository
   * @param {AuthenticationService} authenticationService
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   */
  constructor(private router: Router,
              private snackBar: MatSnackBar,
              public mobileService: MobileService,
              public activatedRoute: ActivatedRoute,
              private configuracaoService: ConfiguracaoService,
              private avaliavelRepository: AvaliavelRepository,
              private authenticationService: AuthenticationService,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
  }

  /**
   *
   */
  ngOnInit() {

    this.avaliavelRepository.listByFilters(
      {
        unidadeTipoAvaliacaoId: this.mobileService.unidadesTiposAvaliacoes.filter(unidadeTipoAvaliacao => unidadeTipoAvaliacao.ordem === this.activatedRoute.snapshot.params['ordem'])[0].id
      }
    )
      .subscribe(page => {
        if (!page.content.length) {
          this.openSnackBar('Vincule atendnetes, itens ou quesitos á essa unidade nessa avaliação');
          this.router.navigate(['conclusao'])
        }
      });


    if (this.mobileService.unidadesTiposAvaliacoes && this.mobileService.unidadesTiposAvaliacoes.length) {

      const local = this.mobileService.getUnidadeTipoAvaliacaoByIndex(this.activatedRoute.snapshot.params['ordem']);

      if (!local)
        this.router.navigate(['selecionar-avaliacao']);

      this.unidadeTipoAvaliacaoRepository.findById(local.id)
        .subscribe(result => this.unidadeTipoAvaliacao = result)

    }

    this.iconRegistry.addSvgIconInNamespace('assets', 'pessimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/pessimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'regular', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/regular.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'bom', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/bom.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'otimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/otimo.svg'));

    /**
     * Se não tem unidade selecionada vai para tela de selação de unidade
     */
    if (!this.mobileService.getUnidadeId())
      this.router.navigate(['../selecionar-unidade']);

    this.configuracaoService.configuracao.subscribe(result => this.configuracao = result)

  }

  /**
   *
   */
  public avaliar(nota: number) {
    this.mobileService.setNota(nota);
    this.router.navigate(['avaliar/' + (+this.activatedRoute.snapshot.params['ordem']) + '/selecionar-atendentes']);
  }

  /**
   *
   */
  public logout(): void {
    this.mobileService.removeUnidade();
    this.authenticationService.logout();
    this.router.navigate(['/authentication']);
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }

}
