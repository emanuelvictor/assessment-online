import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TdLoadingService} from "@covalent/core";
import {MatSnackBar} from "@angular/material";
import {MobileService} from "../../../../../service/mobile.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {AbstractComponent} from "../abstract/abstract.component";
import {viewAnimation} from "../../../../../../../web/domain/presentation/controls/utils";
import {AvaliavelRepository} from "../../../../../../../web/domain/repository/avaliavel.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../../../web/domain/repository/unidade-tipo-avaliacao.repository";
import {TipoFeedback} from "../../../../../../../web/domain/entity/configuracao/tipo-feedback.enum";
import {cpfValidator, obrigatorio} from "../../../../../../../web/domain/presentation/controls/validators/validators";
import {textMasks} from "../../../../../../../web/domain/presentation/controls/text-masks/text-masks";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class FeedbackComponent extends AbstractComponent implements OnInit {

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
   * @param {Router} router
   * @param fb
   * @param {MatSnackBar} snackBar
   * @param {MobileService} mobileService
   * @param {ActivatedRoute} activatedRoute
   * @param {TdLoadingService} _loadingService
   * @param {AvaliavelRepository} avaliavelRepository
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   */
  constructor(private avaliavelRepository: AvaliavelRepository,
              private fb: FormBuilder, public snackBar: MatSnackBar,
              public _loadingService: TdLoadingService, private router: Router,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository,
              public mobileService: MobileService, public activatedRoute: ActivatedRoute) {
    super(snackBar, mobileService, _loadingService);
  }

  /**
   *
   */
  ngOnInit() {
    // Debounce da digitação, toda vez que o usuário digita alguma coisa, depois de 300 milisegundos ele executa isso.
    this.modelChanged.debounceTime(300).subscribe(() => {
      // Restarta o timeout
      this.restartTimeout()
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
    // Workaround
    // Tempo de espera padrão para concluir o timeout.
    // Isso se reflete na experiência do usuário
    setTimeout(() => {
      this._loadingService.resolve('overlayStarSyntax')
    }, 300)
  }

  /**
   *
   */
  public proximo() {

    // Restarta o timeout
    this.restartTimeout();

    // Valida o formulário
    if (!this.form.valid) {
      return;
    }

    this.router.navigate(['/avaliar/' + (+this.activatedRoute.parent.snapshot.params.unidadeId) + '/' + this.activatedRoute.snapshot.params.ordem + '/conclusao'])
  }
}
