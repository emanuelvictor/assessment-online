import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MobileService} from '../../../service/mobile.service';
import {UnidadeService} from '../../../../../web/domain/service/unidade.service';
import {MatSnackBar} from "@angular/material";
import {TdLoadingService} from "@covalent/core";
import {viewAnimation} from "../../../../../web/domain/presentation/controls/utils";
import {UnidadeTipoAvaliacao} from "../../../../../web/domain/entity/avaliacao/unidade-tipo-avaliacao.model";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../web/domain/repositories/unidade-tipo-avaliacao.repository";

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
  model: any;

  /**
   *
   */
  unidades: any;

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MobileService} mobileService
   * @param {UnidadeService} unidadeService
   * @param _loadingService
   */
  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private mobileService: MobileService,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository,
              private unidadeService: UnidadeService,
              private _loadingService: TdLoadingService) {
  }

  /**
   *
   */
  ngOnInit() {
    this._loadingService.register('overlayStarSyntax');
    this.consultarUnidades();
  }

  /**
   *
   */
  consultarUnidades() {
    this.unidadeService.listLightByFilters(null)
      .subscribe(result => {
        this.unidades = result.content;
        if (this.unidades.length === 1) {
          this.selecionar(this.unidades[0]);
        } else if (!this.unidades.length) {
          this.openSnackBar('Insira unidades de atendimento pela plataforma web');
          this.router.navigate(['conclusao']);
          this._loadingService.resolve('overlayStarSyntax');
        } else {
          this._loadingService.resolve('overlayStarSyntax');
        }
      });
  }

  /**
   *
   * @param unidade
   */
  afterExpand(unidade) {
    unidade.checked = true;
    this.unidadeTipoAvaliacaoRepository.listByUnidadeId({unidadeId: unidade.id})
      .subscribe(result => {
        result.content = result.content.map(unidadeTipoAvaliacao => {
          unidadeTipoAvaliacao.checked = true;
          return unidadeTipoAvaliacao
        });
        unidade.unidadesTiposAvaliacoes = result.content
      })
  }

  /**
   *
   * @param unidade
   */
  afterCollapse(unidade) {
    unidade.checked = false;
    unidade.unidadesTiposAvaliacoes = []
  }

  /**
   *
   * @param unidade
   */
  selecionar(unidade) {

    this.mobileService.setUnidadeId(unidade.id);

    this.mobileService.setHashsByUnidadeId(unidade.id);

    const that = this; // TODO falcatruaaasssaaa ... pra que dê tempo do setUnidadeId e setHashsByUnidadeId terminarem
    setTimeout(function () {
      that.router.navigate(['selecionar-avaliacao']);
      that._loadingService.resolve('overlayStarSyntax');
    }, 1000) // TODO falcatruaaasssaaa ... pra que dê tempo do setUnidadeId e setHashsByUnidadeId terminarem

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
