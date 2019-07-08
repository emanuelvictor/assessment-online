import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Avaliacao} from "../../../../entity/avaliacao/avaliacao.model";
import {Questionario} from "../../../../entity/avaliacao/questionario.model";
import {QuestionarioRepository} from "../../../../repository/questionario.repository";
import {ConfirmDialogComponent} from "../../../controls/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'visualizar-questionario',
  templateUrl: './visualizar-questionario.component.html',
  styleUrls: ['./visualizar-questionario.component.scss']
})
export class VisualizarQuestionarioComponent implements OnInit {

  /**
   *
   * @type {Avaliacao}
   */
  questionario: Questionario = new Questionario();

  /**
   *
   * @param snackBar {MatSnackBar}
   * @param activatedRoute {ActivatedRoute}
   * @param router {Router}
   * @param dialog {MatDialog}
   * @param questionarioRepository {QuestionarioRepository}
   */
  constructor(private snackBar: MatSnackBar,
              public activatedRoute: ActivatedRoute,
              private router: Router, private dialog: MatDialog,
              private questionarioRepository: QuestionarioRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    const questionarioId: number = this.activatedRoute.snapshot.params['id'];
    this.find(questionarioId)
  }

  /**
   *
   * @param {number} questionarioId
   */
  public find(questionarioId: number) {
    this.questionarioRepository.findById(questionarioId)
      .subscribe((questionario: Questionario) =>{
        this.questionario = questionario}
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
        this.questionarioRepository.delete(this.questionario.id)
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
