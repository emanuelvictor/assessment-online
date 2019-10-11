import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {textMasks} from '@src/web/domain/presentation/controls/text-masks/text-masks';
import {MobileService} from '@src/mobile/domain/service/mobile.service';
import {TipoFeedback} from '@src/web/domain/entity/configuracao/tipo-feedback.enum';
import {cpfValidator, obrigatorio} from '@src/web/domain/presentation/controls/validators/validators';
import {viewAnimation} from '@src/web/domain/presentation/controls/utils';

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
   * @param {MobileService} mobileService
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(private router: Router,
              private fb: FormBuilder,
              public mobileService: MobileService,
              public activatedRoute: ActivatedRoute) {
  }

  /**
   *
   */
  ngOnInit() {

    this.form = this.fb.group({
      feedback: ['feedback', []]
    });

    if (!this.mobileService.configuracao || !this.mobileService.configuracao.tipoFeedback)
    // Se não tem configuração requisitada, vai para a tela de avaliação.
    {
      this.router.navigate(['avaliar/' + this.mobileService.dispositivo.numeroLicenca]);
      return
    }

    // Debounce da digitação, toda vez que o usuário digita alguma coisa, depois de 300 milisegundos ele executa isso.
    this.modelChanged.debounceTime(300).subscribe(() => {

      // Restarta o timeout
      this.mobileService.restartTimeout()
    });

    if (this.mobileService.configuracao.tipoFeedback === <any>TipoFeedback[TipoFeedback.TEXTO]) {
      this.form = this.mobileService.configuracao.feedbackObrigatorio ? this.fb.group({
        feedback: ['feedback', [obrigatorio()]]
      }) : this.fb.group({
        feedback: ['feedback', []]
      })
    }

    if (this.mobileService.configuracao.tipoFeedback === <any>TipoFeedback[TipoFeedback.EMAIL]) {
      this.form = this.mobileService.configuracao.feedbackObrigatorio ? this.fb.group({
        feedback: ['feedback', [obrigatorio(), Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]]
      }) : this.fb.group({
        feedback: ['feedback', [Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]]
      })
    }

    if (this.mobileService.configuracao.tipoFeedback === <any>TipoFeedback[TipoFeedback.CPF]) {
      this.form = this.mobileService.configuracao.feedbackObrigatorio ? this.fb.group({
        feedback: ['feedback', [obrigatorio(), cpfValidator()]]
      }) : this.fb.group({
        feedback: ['feedback', [cpfValidator()]]
      })
    }

    if (this.mobileService.configuracao.tipoFeedback === <any>TipoFeedback[TipoFeedback.TELEFONE]) {
      this.form = this.mobileService.configuracao.feedbackObrigatorio ? this.fb.group({
        feedback: ['feedback', [obrigatorio()]]
      }) : this.fb.group({
        feedback: ['feedback', []]
      })
    }

    // Retirar o loading
    this.mobileService.resolve('overlayStarSyntax')
  }

  /**
   *
   */
  public proximo() {

    // Valida o formulário
    if (!this.form.valid) {
      return
    }

    this.router.navigate(['avaliar/' + this.mobileService.dispositivo.numeroLicenca + '/' + (+this.activatedRoute.parent.snapshot.params.unidadeId) + '/conclusao'])
  }

  /**
   *
   */
  ngOnDestroy(): void {
    // Restarta o timeout
    this.mobileService.restartTimeout();
    this.mobileService.resolve('overlayStarSyntax')
  }
}
