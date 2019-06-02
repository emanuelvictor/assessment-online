import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MobileService} from '../../../service/mobile.service';
import {MatSnackBar} from "@angular/material";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../web/domain/repositories/unidade-tipo-avaliacao.repository";
import {Configuracao} from "../../../../../web/domain/entity/configuracao/configuracao.model";
import {TdLoadingService} from "@covalent/core";
import {Unidade} from "../../../../../web/domain/entity/unidade/unidade.model";
import {ConfiguracaoRepository} from "../../../../../web/domain/repositories/configuracao.repository";

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
   */
  timeout: any;

  /**
   *
   */
  time = 30000;

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
    this._loadingService.register('overlayStarSyntax');
    this.configuracaoRepository.requestConfiguracao.subscribe(configuracao => {
      this.configuracao = configuracao;
      this.mobileService.unidades.subscribe(unidades => {
        this.unidades = unidades;
        this._loadingService.resolve('overlayStarSyntax');
      });
    });

    this.timeout = setTimeout(() => {
      this.mobileService.reset();
      this.router.navigate(['/avaliar/1']);
      this._loadingService.resolve('overlayStarSyntax');
    }, this.time);
  }

  /**
   *
   */
  public clearTimeout() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.mobileService.reset(), this.time);
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
