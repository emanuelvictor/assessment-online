import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Configuracao} from "../../../../../../../web/domain/entity/configuracao/configuracao.model";
import {TdLoadingService} from "@covalent/core";
import {MatSnackBar} from "@angular/material";
import {MobileService} from "../../../../../service/mobile.service";
import {FormBuilder} from "@angular/forms";
import {Subject} from "rxjs";
import {AbstractComponent} from "../abstract/abstract.component";
import {viewAnimation} from "../../../../../../../web/domain/presentation/controls/utils";
import {AvaliavelRepository} from "../../../../../../../web/domain/repository/avaliavel.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../../../web/domain/repository/unidade-tipo-avaliacao.repository";

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
  configuracao: Configuracao = new Configuracao();

  /**
   *
   */
  form: any;

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

    this.router.navigate(['/avaliar/' + (+this.activatedRoute.parent.snapshot.params.unidadeId) + '/' + this.activatedRoute.snapshot.params.ordem + '/conclusao'])
  }
}
