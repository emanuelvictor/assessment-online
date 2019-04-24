import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfiguracaoRepository} from "../../../../../web/domain/repositories/configuracao.repository";
import {Configuracao} from "../../../../../web/domain/entity/configuracao/configuracao.model";
import {TdLoadingService} from "@covalent/core";
import {MatSnackBar} from "@angular/material";
import {MobileService} from "../../../service/mobile.service";
import {AvaliavelRepository} from "../../../../../web/domain/repositories/avaliavel.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../web/domain/repositories/unidade-tipo-avaliacao.repository";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  /**
   *
   */
  configuracao: Configuracao;

  /**
   *
   */
  timeout: any;

  /**
   *
   */
  time = 30000;

  /**
   *
   */
  form: any;

  /**
   *
   * @param {Router} router
   * @param fb
   * @param {MatSnackBar} snackBar
   * @param {MobileService} mobileService
   * @param {ActivatedRoute} activatedRoute
   * @param {TdLoadingService} _loadingService
   * @param {AvaliavelRepository} avaliavelRepository
   * @param configuracaoRepository
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   */
  constructor(private router: Router,
              private fb: FormBuilder,
              private snackBar: MatSnackBar,
              public mobileService: MobileService,
              public activatedRoute: ActivatedRoute,
              private _loadingService: TdLoadingService,
              private avaliavelRepository: AvaliavelRepository,
              private configuracaoRepository: ConfiguracaoRepository,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {
  }

  /**
   *
   */
  ngOnInit() {

    this.form = this.fb.group({
      feedback: ['feedback', []],
    });

    this._loadingService.register('overlayStarSyntax');

    this.configuracaoRepository.configuracao.subscribe(configuracao => {
      this._loadingService.resolve('overlayStarSyntax');
      this.configuracao = configuracao
    });

    this.timeout = setTimeout(() => {
      this.mobileService.reset();
      this.router.navigate(['/avaliar/1']);
      this._loadingService.resolve('overlayStarSyntax');
    }, this.time);
  }

  /**
   *
   */
  public sendFeedback(feedback: string) {
    clearTimeout(this.timeout);
    if (!feedback || !feedback.trim().length) {
      this.router.navigate(['conclusao']);
    } else {
      this.mobileService.sendFeedback(feedback);
    }
  }

  /**
   *
   */
  public clearTimeout() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.mobileService.reset();
      this.router.navigate(['/avaliar/1']);
    }, this.time);
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
