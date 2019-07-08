import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {DomSanitizer} from "@angular/platform-browser";
import {Questionario} from "../../../../entity/avaliacao/questionario.model";
import {QuestionarioRepository} from "../../../../repository/questionario.repository";

@Component({
  selector: 'alterar-questionario',
  templateUrl: './alterar-questionario.component.html',
  styleUrls: ['./alterar-questionario.component.scss']
})
export class AlterarQuestionarioComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Questionario}
   */
  questionario: Questionario = new Questionario();

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {ActivatedRoute} activatedRoute
   * @param {QuestionarioRepository} questionarioRepository
   * @param {DomSanitizer} domSanitizer
   * @param {Router} router
   */
  constructor(private snackBar: MatSnackBar,
              private domSanitizer: DomSanitizer,
              private questionarioRepository: QuestionarioRepository,
              private activatedRoute: ActivatedRoute, private router: Router) {

  }

  /**
   *
   */
  ngOnInit() {
    const avaliacaoId: number = this.activatedRoute.snapshot.params['id'];
    this.find(avaliacaoId);
  }

  /**
   *
   */
  public save(): void {
    this.questionarioRepository.save(this.questionario)
      .then(result => {
        this.questionario = result;

        this.success('Tipo de avaliação inserida com sucesso');
      });
  }

  /**
   *
   * @param message
   */
  public success(message: string) {
    this.openSnackBar(message);
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }

  /**
   *
   * @param {number} avaliacaoId
   */
  public find(avaliacaoId: number) {
    this.questionarioRepository.findById(avaliacaoId)
      .subscribe((questionario: Questionario) => {
          this.questionario = questionario;
        }
      )
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
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }
}
