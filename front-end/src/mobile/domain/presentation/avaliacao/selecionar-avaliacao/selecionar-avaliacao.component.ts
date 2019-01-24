import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {MobileService} from '../../../service/mobile.service';
import {MatSnackBar} from "@angular/material";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../web/domain/repositories/unidade-tipo-avaliacao.repository";

@Component({
  selector: 'selecionar-avaliacao',
  templateUrl: './selecionar-avaliacao.component.html',
  styleUrls: ['./selecionar-avaliacao.component.scss']
})
export class SelecionarAvaliacaoComponent {

  /**
   *
   */
  unidadesTiposAvaliacoesSelecionados: any;

  /**
   *
   */
  unidadesTiposAvaliacoes: any;

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MobileService} mobileService
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   */
  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private mobileService: MobileService,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {
    this.listByUnidadeId();
  }

  /**
   *
   */
  listByUnidadeId() {

    this.unidadeTipoAvaliacaoRepository.listByUnidadeId({unidadeId: this.mobileService.unidade.id, ativo: true})
      .subscribe(result => {

        this.unidadesTiposAvaliacoes = result.content;

        if (this.unidadesTiposAvaliacoes.length === 1) {
          this.unidadesTiposAvaliacoes[0].ordem = 1;
          this.continue()
        }

      });

  }

  /**
   *
   * @param unidadeTipoAvaliacao
   */
  public order(unidadeTipoAvaliacao) {

    if (unidadeTipoAvaliacao.ordem) {

      for (let i = 0; i < this.unidadesTiposAvaliacoes.length; i++) {
        if (this.unidadesTiposAvaliacoes[i].ordem > unidadeTipoAvaliacao.ordem) {
          this.unidadesTiposAvaliacoes[i].ordem = this.unidadesTiposAvaliacoes[i].ordem - 1;
        }
      }

      unidadeTipoAvaliacao.ordem = null;

      return;
    }

    let aux = 0;

    for (let i = 0; i < this.unidadesTiposAvaliacoes.length; i++) {
      if (this.unidadesTiposAvaliacoes[i].ordem && this.unidadesTiposAvaliacoes[i].ordem > aux)
        aux = this.unidadesTiposAvaliacoes[i].ordem;
    }

    unidadeTipoAvaliacao.ordem = aux + 1;

  }

  /**
   *
   */
  public continue(): void {

    if (!this.unidadesTiposAvaliacoes || !this.unidadesTiposAvaliacoes.length) {
      this.openSnackBar('Selecione ao menos uma avaliação');
      return;
    }

    this.mobileService.unidadesTiposAvaliacoes = this.unidadesTiposAvaliacoes.filter(unidadeTipoAvaliacao => unidadeTipoAvaliacao.ordem !== null && unidadeTipoAvaliacao.ordem !== 0);

    this.router.navigate(['avaliar/1']);

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
