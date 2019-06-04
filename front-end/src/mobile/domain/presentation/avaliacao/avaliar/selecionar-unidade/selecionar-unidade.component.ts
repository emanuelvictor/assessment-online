import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MobileService} from '../../../../service/mobile.service';
import {MatSnackBar} from "@angular/material";
import {Configuracao} from "../../../../../../web/domain/entity/configuracao/configuracao.model";
import {TdLoadingService} from "@covalent/core";
import {ConfiguracaoRepository} from "../../../../../../web/domain/repositories/configuracao.repository";
import {Unidade} from "../../../../../../web/domain/entity/unidade/unidade.model";

@Component({
  selector: 'selecionar-unidade',
  templateUrl: './selecionar-unidade.component.html',
  styleUrls: ['./selecionar-unidade.component.scss']
})
export class SelecionarUnidadeComponent implements OnInit {

  /**
   *
   */
  unidades: Unidade[];

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
   * @param configuracaoRepository
   */
  constructor(private mobileService: MobileService,
              private _loadingService: TdLoadingService,
              private router: Router, private snackBar: MatSnackBar,
              private configuracaoRepository: ConfiguracaoRepository) {

  }

  /**
   *
   */
  ngOnInit() {

    // Registra o loading.
    this._loadingService.register('overlayStarSyntax');

    // Requisita configuração.
    this.configuracaoRepository.requestConfiguracao.subscribe(configuracao => {
      this.configuracao = configuracao;

      // Pega  configuração.
      this.mobileService.unidades.subscribe(unidades => {
        this.unidades = unidades;

        // Se não tem unidades selecionadas, vai para tela de seleção de unidades
        if (!this.unidades.length) {
          this.router.navigate(['/configurar-unidades-e-avaliacoes']);
          this._loadingService.resolve('overlayStarSyntax');
          return;
        }

        // Se só tem uma unidade selecionada, passa direito e vai pra tela de avaliação
        if (this.unidades.length === 1) {
          this.router.navigate(['/avaliar/' + this.unidades[0].id], {queryParams: {ordem: 1}});
          this._loadingService.resolve('overlayStarSyntax');
          return;
        }

        // Caso tenha unidades a selecionar, e a quantidade seja maior que 1
        // Remove loading
        this._loadingService.resolve('overlayStarSyntax');

      });

    });

  }

  /**
   *
   * @param unidade
   */
  public proximo(unidade: Unidade) {
    setTimeout(() => {
      this.router.navigate(['/avaliar/' + (+unidade.id)], {queryParams: {ordem: 1}});
    }, 300);
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