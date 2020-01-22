import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Avaliacao} from '../../../../../domain/entity/avaliacao/avaliacao.model';
import {CupomRepository} from '../../../../../domain/repository/cupom.repository';
import {ConfirmDialogComponent} from '../../../controls/confirm-dialog/confirm-dialog.component';
import {viewAnimation} from '../../../controls/utils';
import {Cupom} from '../../../../../domain/entity/assinatura/cupom.model';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';

@Component({
  selector: 'visualizar-cupom',
  templateUrl: './visualizar-cupom.component.html',
  styleUrls: ['./visualizar-cupom.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class VisualizarCupomComponent implements OnInit {

  /**
   *
   * @type {Avaliacao}
   */
  cupom: Cupom = new Cupom();

  /**
   *
   * @param toastService {MatSnackBar}
   * @param activatedRoute {ActivatedRoute}
   * @param router {Router}
   * @param dialog {MatDialog}
   * @param cupomRepository {CupomRepository}
   */
  constructor(private cupomRepository: CupomRepository,
              private router: Router, private dialog: MatDialog,
              private toastService: ToastService, public activatedRoute: ActivatedRoute) {
  }

  /**
   *
   */
  ngOnInit() {
    const id: number = this.activatedRoute.snapshot.params['id'];
    this.find(id)
  }

  /**
   *
   * @param {number} id
   */
  public find(id: number) {
    this.cupomRepository.findById(id)
      .subscribe(result => this.cupom = result)
  }

  /**
   *
   */
  public remove(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: 'Tem certeza que deseja excluir esse Cupom?',
          confirm: 'Sim',
          cancel: 'Não'
        }
      }
    );

    dialogRef.afterClosed().subscribe(remover => {
      if (remover) {
        this.cupomRepository.delete(id)
          .then(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.toastService.open('Cupom excluído com sucesso', 'Fechar', {
              duration: 3000
            })
          })
      }
    })
  }

  /**
   *
   * @param message
   */
  public error(message: string) {
    this.openSnackBar(message)
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