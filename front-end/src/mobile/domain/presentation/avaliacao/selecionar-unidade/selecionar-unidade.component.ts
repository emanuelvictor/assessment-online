import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MobileService} from '../../../service/mobile.service';
import {UnidadeService} from '../../../../../web/domain/service/unidade.service';
import {MatSnackBar} from "@angular/material";
import {TdLoadingService} from "@covalent/core";
import {viewAnimation} from "../../../../../web/domain/presentation/controls/utils";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../web/domain/repositories/unidade-tipo-avaliacao.repository";
import {Observable} from "rxjs";

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
   * @param unidadeTipoAvaliacaoRepository
   */
  constructor(private _loadingService: TdLoadingService,
              private unidadeService: UnidadeService, private router: Router,
              private mobileService: MobileService, private snackBar: MatSnackBar,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {
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
          this.setHashsByUnidade(this.unidades[0]);
        } else if (!this.unidades.length) {
          this.openSnackBar('Insira unidades de atendimento pela plataforma web');
          this.router.navigate(['conclusao']);
          this._loadingService.resolve('overlayStarSyntax');
        } else {
          this._loadingService.resolve('overlayStarSyntax')
        }
      })
  }

  /**
   *
   * @param unidade
   */
  afterExpand(unidade) {
    unidade.checked = true;
    this.unidadeTipoAvaliacaoRepository.listByUnidadeId({unidadeId: unidade.id})
      .subscribe(result => {
        for (let i = 0; i < result.content.length; i++) {
          result.content[i].unidade = unidade;
          result.content[i].checked = true;
          result.content[i].ordem = i + 1;
        }
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
   * @param unidadeTipoAvaliacao
   */
  changeUnidadeTipoAvaliacao(unidadeTipoAvaliacao) {
    unidadeTipoAvaliacao.unidade.checked = unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes && (unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes.filter(unidadeTipoAvaliaca => unidadeTipoAvaliaca.checked).length > 0)

    if (unidadeTipoAvaliacao.ordem) {

      for (let i = 0; i < unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes.length; i++) {
        if (unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes[i].ordem > unidadeTipoAvaliacao.ordem) {
          unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes[i].ordem = unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes[i].ordem - 1;
        }
      }

      unidadeTipoAvaliacao.ordem = null;

      return;
    }

    let aux = 0;

    for (let i = 0; i < unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes.length; i++) {
      if (unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes[i].ordem && unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes[i].ordem > aux) {
        aux = unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes[i].ordem;
      }
    }

    unidadeTipoAvaliacao.ordem = aux + 1;
  }

  /**
   *
   * @param unidades
   */
  public proximo(unidades: any) {

    const unidadesTiposAvaliacoes = [];

    unidades.filter(unidade => unidade.checked).map(unidade => unidade.unidadesTiposAvaliacoes).forEach(a => {
      a.forEach(b => {
        if (b.checked) {
          unidadesTiposAvaliacoes.push(b)
        }
      })
    });

    this.mobileService.unidadesTiposAvaliacoes = unidadesTiposAvaliacoes;
    this.mobileService.unidades = unidades.filter(unidade => unidade.checked);
    this.mobileService.unidades.subscribe(unidadess => {
      console.log(unidadess);
      for (let i = 0; i < unidadess.length; i++) {
        this.setHashsByUnidade(unidadess[i]).subscribe(() => {
          if (i === unidadess.length - 1) {
            this.router.navigate(['selecionar-avaliacao']);
            this._loadingService.resolve('overlayStarSyntax');
          }
        })
      }
    })

  }

  /**
   *
   * @param unidade
   */
  private setHashsByUnidade(unidade): Observable<any> {
    return this.mobileService.setHashsByUnidadeId(unidade.id)
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
