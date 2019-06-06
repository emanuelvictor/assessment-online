import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfiguracaoRepository} from "../../../../../../web/domain/repositories/configuracao.repository";
import {Configuracao} from "../../../../../../web/domain/entity/configuracao/configuracao.model";
import {TdLoadingService} from "@covalent/core";
import {MatSnackBar} from "@angular/material";
import {MobileService} from "../../../../service/mobile.service";
import {AvaliavelRepository} from "../../../../../../web/domain/repositories/avaliavel.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../../web/domain/repositories/unidade-tipo-avaliacao.repository";
import {FormBuilder} from "@angular/forms";
import {Subject} from "rxjs";
import {Agrupador} from "../../../../../../web/domain/entity/avaliacao/agrupador.model";
import {AbstractComponent} from "../../abstract/abstract.component";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent extends AbstractComponent implements OnInit {

  /**
   *
   */
  configuracao: Configuracao = new Configuracao();

  /**
   *
   */
  form: any;

  /**
   *
   * @type {Subject<string>}
   */
  private modelChanged: Subject<string> = new Subject<string>();

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
  constructor(public _loadingService: TdLoadingService,
              private avaliavelRepository: AvaliavelRepository,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository,
              public mobileService: MobileService, public activatedRoute: ActivatedRoute,
              private router: Router, private fb: FormBuilder, public snackBar: MatSnackBar) {
    super(snackBar, mobileService, _loadingService)
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

    this.form = this.fb.group({
      feedback: ['feedback', []]
    });

    // Workarround
    // Tempo de espera padrão para concluir o timeout.
    // Isso se reflete na experiência do usuário
    setTimeout(() => {
      this._loadingService.resolve('overlayStarSyntax')
    }, 300)
  }

  /**
   *
   */
  public sendFeedback(feedback: string) {

    // Restarta o timeout
    this.restartTimeout();

    if (feedback && feedback.trim().length) {
      this.mobileService.sendFeedback(feedback).then(() => {
        // Zera o agrupador
        this.mobileService.agrupador = new Agrupador();
        this.router.navigate(['/avaliar/' + (+this.activatedRoute.parent.snapshot.params.unidadeId) + '/' + this.activatedRoute.snapshot.params.ordem + '/conclusao'])
      })
    } else {
      this.mobileService.agrupador = new Agrupador();
      this.router.navigate(['/avaliar/' + (+this.activatedRoute.parent.snapshot.params.unidadeId) + '/' + this.activatedRoute.snapshot.params.ordem + '/conclusao'])
    }
  }
}
