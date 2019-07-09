import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Avaliacao} from "../../../../entity/avaliacao/avaliacao.model";
import {Dispositivo} from "../../../../entity/avaliacao/dispositivo.model";
import {DispositivoRepository} from "../../../../repository/dispositivo.repository";
import {ConfirmDialogComponent} from "../../../controls/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'visualizar-dispositivo',
  templateUrl: './visualizar-dispositivo.component.html',
  styleUrls: ['./visualizar-dispositivo.component.scss']
})
export class VisualizarDispositivoComponent implements OnInit {

  /**
   *
   * @type {Avaliacao}
   */
  dispositivo: Dispositivo = new Dispositivo();

  /**
   *
   * @param snackBar {MatSnackBar}
   * @param activatedRoute {ActivatedRoute}
   * @param router {Router}
   * @param dialog {MatDialog}
   * @param dispositivoRepository {DispositivoRepository}
   */
  constructor(private snackBar: MatSnackBar,
              public activatedRoute: ActivatedRoute,
              private router: Router, private dialog: MatDialog,
              private dispositivoRepository: DispositivoRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    const dispositivoId: number = this.activatedRoute.snapshot.params['id'];
    this.find(dispositivoId)
  }

  /**
   *
   * @param {number} dispositivoId
   */
  public find(dispositivoId: number) {
    this.dispositivoRepository.findById(dispositivoId)
      .subscribe((dispositivo: Dispositivo) =>{
        this.dispositivo = dispositivo}
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
        this.dispositivoRepository.delete(this.dispositivo.id)
          .then(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.snackBar.open('Unidade excluído com sucesso', 'Fechar', {
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
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    })
  }
}
