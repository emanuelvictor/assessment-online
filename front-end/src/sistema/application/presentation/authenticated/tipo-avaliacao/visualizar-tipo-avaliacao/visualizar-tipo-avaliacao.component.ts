import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Avaliacao} from '@src/sistema/domain/entity/avaliacao/avaliacao.model';
import {TipoAvaliacao} from '@src/sistema/domain/entity/avaliacao/tipo-avaliacao.model';
import {TipoAvaliacaoRepository} from '@src/sistema/domain/repository/tipo-avaliacao.repository';
import {ConfirmDialogComponent} from '../../../controls/confirm-dialog/confirm-dialog.component';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'visualizar-tipo-avaliacao',
  templateUrl: './visualizar-tipo-avaliacao.component.html',
  styleUrls: ['./visualizar-tipo-avaliacao.component.scss']
})
export class VisualizarTipoAvaliacaoComponent implements OnInit {

  /**
   *
   * @type {Avaliacao}
   */
  tipoAvaliacao: TipoAvaliacao = new TipoAvaliacao();

  /**
   *
   * @param toastService {ToastService}
   * @param activatedRoute {ActivatedRoute}
   * @param router {Router}
   * @param dialog {MatDialog}
   * @param tipoAvaliacaoRepository {TipoAvaliacaoRepository}
   */
  constructor(private toastService: ToastService,
              public activatedRoute: ActivatedRoute,
              private router: Router, private dialog: MatDialog,
              private tipoAvaliacaoRepository: TipoAvaliacaoRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    const tipoAvaliacaoId: number = this.activatedRoute.snapshot.params['id'];
    this.find(tipoAvaliacaoId);
  }

  /**
   *
   * @param {number} tipoAvaliacaoId
   */
  public find(tipoAvaliacaoId: number) {
    this.tipoAvaliacaoRepository.findById(tipoAvaliacaoId)
      .subscribe((tipoAvaliacao: TipoAvaliacao) => {
          this.tipoAvaliacao = tipoAvaliacao
        }
      )
  }

  /**
   *
   */
  public remove() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: 'Isso vai remover também todas as avaliações realizadas para este tipo de avaliação, incluindo as vinculadas á itens avaliáveis. Deseja realmente prosseguir?',
          confirm: 'Sim',
          cancel: 'Não'
        }
      }
    );

    dialogRef.afterClosed().subscribe(remover => {
      if (remover) {
        this.tipoAvaliacaoRepository.delete(this.tipoAvaliacao.id)
          .then(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.toastService.open('Unidade excluído com sucesso', 'Fechar', {
              duration: 3000
            });
          })
      }
    });
  }

  /**
   *
   * @param message
   */
  public error(message: string) {
    this.openSnackBar(message);
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.toastService.open(message, 'Fechar', {
      duration: 5000
    });
  }
}
