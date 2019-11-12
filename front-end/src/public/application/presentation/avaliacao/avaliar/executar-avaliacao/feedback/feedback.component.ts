import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {textMasks} from '@src/sistema/application/presentation/controls/text-masks/text-masks';
import {PublicService} from '@src/public/domain/service/public.service';
import {TipoFeedback} from '@src/sistema/domain/entity/configuracao/tipo-feedback.enum';
import {cpfValidator, obrigatorio} from '@src/sistema/application/presentation/controls/validators/validators';
import {viewAnimation} from '@src/sistema/application/presentation/controls/utils';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class FeedbackComponent implements OnInit, OnDestroy {

  /**
   *
   */
  form: any;

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Subject<string>}
   */
  public modelChanged: Subject<any> = new Subject<any>();

  /**
   *
   * @param router
   * @param fb
   * @param {PublicService} publicService
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(private router: Router,
              private fb: FormBuilder,
              public publicService: PublicService,
              public activatedRoute: ActivatedRoute) {
  }

  /**
   *
   */
  ngOnInit() {

    this.form = this.fb.group({
      feedback: ['feedback', []]
    });

    if (!this.publicService.configuracao || !this.publicService.configuracao.tipoFeedback)
    // Se não tem configuração requisitada, vai para a tela de avaliação.
    {
      this.router.navigate(['avaliar/' + this.publicService.dispositivo.numeroLicenca]);
      return
    }

    // Debounce da digitação, toda vez que o usuário digita alguma coisa, depois de 300 milisegundos ele executa isso.
    this.modelChanged.debounceTime(300).subscribe(() => {

      // Restarta o timeout
      this.publicService.restartTimeout()
    });

    if (this.publicService.configuracao.tipoFeedback === <any>TipoFeedback[TipoFeedback.TEXTO]) {
      this.form = this.publicService.configuracao.feedbackObrigatorio ? this.fb.group({
        feedback: ['feedback', [obrigatorio()]]
      }) : this.fb.group({
        feedback: ['feedback', []]
      })
    }

    if (this.publicService.configuracao.tipoFeedback === <any>TipoFeedback[TipoFeedback.EMAIL]) {
      this.form = this.publicService.configuracao.feedbackObrigatorio ? this.fb.group({
        feedback: ['feedback', [obrigatorio(), Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]]
      }) : this.fb.group({
        feedback: ['feedback', [Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]]
      })
    }

    if (this.publicService.configuracao.tipoFeedback === <any>TipoFeedback[TipoFeedback.CPF]) {
      this.form = this.publicService.configuracao.feedbackObrigatorio ? this.fb.group({
        feedback: ['feedback', [obrigatorio(), cpfValidator()]]
      }) : this.fb.group({
        feedback: ['feedback', [cpfValidator()]]
      })
    }

    if (this.publicService.configuracao.tipoFeedback === <any>TipoFeedback[TipoFeedback.TELEFONE]) {
      this.form = this.publicService.configuracao.feedbackObrigatorio ? this.fb.group({
        feedback: ['feedback', [obrigatorio()]]
      }) : this.fb.group({
        feedback: ['feedback', []]
      })
    }

    // Retirar o loading
    this.publicService.resolve('overlayStarSyntax')
  }

  /**
   *
   */
  public proximo() {

    // Valida o formulário
    if (!this.form.valid) {
      return
    }

    this.router.navigate(['avaliar/' + this.publicService.dispositivo.numeroLicenca + '/' + (+this.activatedRoute.parent.snapshot.params.unidadeId) + '/conclusao'])
  }

  /**
   *
   */
  ngOnDestroy(): void {
    // Restarta o timeout
    this.publicService.restartTimeout();
    this.publicService.resolve('overlayStarSyntax')
  }
}
