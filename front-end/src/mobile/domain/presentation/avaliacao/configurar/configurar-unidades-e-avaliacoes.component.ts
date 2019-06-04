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
  selector: 'configurar-unidades-e-avaliacoes',
  templateUrl: './configurar-unidades-e-avaliacoes.component.html',
  styleUrls: ['./configurar-unidades-e-avaliacoes.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class ConfigurarUnidadesEAvaliacoesComponent implements OnInit {

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
    this.unidadeService.listLightByFilters({withAvaliaveisFilter: true})
      .subscribe(result => {
        this.unidades = result.content;

        // Se só houver uma unidade.
        if (this.unidades.length === 1) {
          // Se só houver uma unidade, seleciona a primeira.
          this.unidades[0].checked = true;
          this.unidadeTipoAvaliacaoRepository.listByUnidadeId({unidadeId: this.unidades[0].id, ativo: true})
            .subscribe(resulted => {

              // Assinala todos os tipos de avaliações como checkes, ou seja, marcados no checkbox.
              // Define as ordens dos tipos de avaliações
              for (let i = 0; i < resulted.content.length; i++) {
                resulted.content[i].checked = true;
                resulted.content[i].ordem = i + 1;
              }

              // Popula lista do model.
              this.unidades[0].unidadesTiposAvaliacoes = resulted.content;

              // Se só houver somente um tipo de avaliação.
              if (resulted.content.length === 1) {
                // Vai para o próximo passo.
                this.proximo(this.unidades);
                // Encerra o loading.
                this._loadingService.resolve('overlayStarSyntax');
                return
              }

              // Encerra o loading
              this._loadingService.resolve('overlayStarSyntax');
            })
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
    this.unidadeTipoAvaliacaoRepository.listByUnidadeId({unidadeId: unidade.id, ativo: true})
      .subscribe(result => {
        if (!result.content.length) {
          this.openSnackBar('Vincule Ítens Avaliáveis á esses Tipos de Avaliações');
          unidade.checked = false;
          return
        }
        unidade.checked = true;
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
    unidadeTipoAvaliacao.unidade.checked = unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes && (unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes.filter(unidadeTipoAvaliaca => unidadeTipoAvaliaca.checked).length > 0);

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
    this._loadingService.register('overlayStarSyntax');
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
      for (let i = 0; i < unidadess.length; i++) {
        // TODO procedimento funcionado assíncrono, inserindo os hashs assíncronamente com a mudança de tela.
        this.setHashsByUnidade(unidadess[i]);
        if (i === unidadess.length - 1) {
          this.router.navigate(['selecionar-unidade']);
          this._loadingService.resolve('overlayStarSyntax');
        }
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
