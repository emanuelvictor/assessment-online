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
  model: any;

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
        this.mobileService.unidadesTiposAvaliacoes = this.unidadesTiposAvaliacoes;
      });
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
