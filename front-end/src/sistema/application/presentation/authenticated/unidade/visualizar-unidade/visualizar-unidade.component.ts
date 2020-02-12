import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Unidade} from '@src/sistema/domain/entity/unidade/unidade.model';
import {UnidadeService} from '@src/sistema/domain/service/unidade.service';
import {ConfirmDialogComponent} from '../../../controls/confirm-dialog/confirm-dialog.component';
import {AuthenticationService} from '@src/sistema/domain/service/authentication.service';
import {TipoAvaliacaoRepository} from '@src/sistema/domain/repository/tipo-avaliacao.repository';
import {UnidadeTipoAvaliacaoRepository} from '@src/sistema/domain/repository/unidade-tipo-avaliacao.repository';
import {viewAnimation} from '../../../controls/utils';
import {UnidadeTipoAvaliacao} from '@src/sistema/domain/entity/avaliacao/unidade-tipo-avaliacao.model';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'visualizar-unidade',
  templateUrl: './visualizar-unidade.component.html',
  styleUrls: ['./visualizar-unidade.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class VisualizarUnidadeComponent implements OnInit {

  /**
   *
   */
  public tiposAvaliacoes: any;

  /**
   *
   */
  unidade: Unidade;

  /**
   *
   */
  authenticatedUser: any;

  /**
   *
   */
  public filter: any = {
    nome: null,
    enunciado: null
  };

  /**
   *
   * @type {Array}
   */
  public unidadesTiposAvaliacoes = [];

  /**
   *
   * @param toastService
   * @param authenticationService
   * @param tipoAvaliacaoRepository
   * @param activatedRoute
   * @param router
   * @param dialog
   * @param unidadeService
   * @param unidadeTipoAvaliacaoRepository
   */
  constructor(private toastService: ToastService,
              private authenticationService: AuthenticationService,
              private tipoAvaliacaoRepository: TipoAvaliacaoRepository,
              public activatedRoute: ActivatedRoute, private router: Router,
              private dialog: MatDialog, private unidadeService: UnidadeService,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {

    this.authenticationService.requestContaAutenticada().subscribe(result => {
      this.authenticatedUser = result
    })
  }

  /**
   *
   */
  ngOnInit() {
    const unidadeId: number = this.activatedRoute.snapshot.params['id'];
    this.findById(unidadeId);

    this.tipoAvaliacaoRepository.listByFilters(null)
      .subscribe(result => {
        this.tiposAvaliacoes = result.content;

        this.unidadeTipoAvaliacaoRepository.listByFilters({unidadeId: unidadeId}).subscribe(page => {
          this.unidadesTiposAvaliacoes = page.content;
          for (let k = 0; k < this.unidadesTiposAvaliacoes.length; k++) {
            for (let i = 0; i < this.tiposAvaliacoes.length; i++) {
              if (this.tiposAvaliacoes[i].id === this.unidadesTiposAvaliacoes[k].tipoAvaliacao.id) {
                this.tiposAvaliacoes[i].ativo = this.unidadesTiposAvaliacoes[k].ativo
              }
            }
          }
        })
      })
  }

  /**
   *
   * @param {number} id
   */
  public findById(id: number) {
    this.unidadeService.findById(id).subscribe(result => this.unidade = result)
  }

  /**
   *
   */
  public remove(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: 'Isso vai remover também todas as avaliações realizadas para esta unidade, incluindo as vinculadas á itens avaliáveis. Deseja realmente prosseguir?',
          confirm: 'Sim',
          cancel: 'Não'
        }
      }
    );

    dialogRef.afterClosed().subscribe(remover => {
      if (remover) {
        this.unidadeService.delete(id)
          .then(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.toastService.open('Unidade excluída com sucesso', 'Fechar', {
              duration: 3000
            })
          })
      }
    })
  }

  /**
   *
   * @param {TipoAvaliacao} tipoAvaliacao
   */
  public saveUnidadeTipoAvaliacao(tipoAvaliacao): void {

    const unidadeTipoAvaliacao: UnidadeTipoAvaliacao = new UnidadeTipoAvaliacao();
    unidadeTipoAvaliacao.tipoAvaliacao = tipoAvaliacao;
    unidadeTipoAvaliacao.unidade = this.unidade;
    unidadeTipoAvaliacao.ativo = tipoAvaliacao.ativo;

    for (let i = 0; i < this.unidadesTiposAvaliacoes.length; i++) {
      if (tipoAvaliacao.id === this.unidadesTiposAvaliacoes[i].tipoAvaliacao.id) {
        unidadeTipoAvaliacao.id = this.unidadesTiposAvaliacoes[i].id;
      }
    }

    this.unidadeTipoAvaliacaoRepository.save(unidadeTipoAvaliacao)
      .then(result => {

        for (let i = 0; i < this.unidadesTiposAvaliacoes.length; i++) {
          if (result.id === this.unidadesTiposAvaliacoes[i].id) {
            this.unidadesTiposAvaliacoes[i] = result;
            return
          }
        }

        this.unidadesTiposAvaliacoes.push(result)

      })
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

}
