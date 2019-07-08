import {Component, ElementRef, Inject, OnInit, Renderer} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry, MatSnackBar} from "@angular/material";

import {FormBuilder} from "@angular/forms";
import {QuestionarioRepository} from "../../../../repository/questionario.repository";
import {Questionario} from "../../../../entity/avaliacao/questionario.model";
import {ActivatedRoute, Router} from "@angular/router";

/**
 *
 */
@Component({
  selector: 'inserir-questionario',
  templateUrl: './inserir-questionario.component.html',
  styleUrls: ['./inserir-questionario.component.scss']
})
export class InserirQuestionarioComponent implements OnInit {

  /**
   *
   */
  public questionario: Questionario = new Questionario();

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {ElementRef} element
   * @param {QuestionarioRepository} questionarioRepository
   * @param {Renderer} renderer
   * @param {FormBuilder} fb
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   * @param {Router} router
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(@Inject(ElementRef) private element: ElementRef,
              private questionarioRepository: QuestionarioRepository,
              private activatedRoute: ActivatedRoute, private router: Router,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
              private snackBar: MatSnackBar, private renderer: Renderer, private fb: FormBuilder) {
  }

  /**
   *
   */
  ngOnInit(): void {
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
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }

}
