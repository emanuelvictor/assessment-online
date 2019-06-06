import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfiguracaoRepository} from "../../../../../../web/domain/repositories/configuracao.repository";
import {Configuracao} from "../../../../../../web/domain/entity/configuracao/configuracao.model";
import {TdLoadingService} from "@covalent/core";
import {MobileService} from "../../../../service/mobile.service";
import {AbstractComponent} from "../../abstract/abstract.component";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-conclusao',
  templateUrl: './conclusao.component.html',
  styleUrls: ['./conclusao.component.scss']
})
export class ConclusaoComponent extends AbstractComponent implements OnInit {

  /**
   *
   */
  configuracao: Configuracao;

  /**
   *
   * @param snackBar
   * @param {Router} router
   * @param mobileService
   * @param activatedRoute
   * @param {TdLoadingService} _loadingService
   * @param {ConfiguracaoRepository} configuracaoRepository
   */
  constructor(public snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute,
              public _loadingService: TdLoadingService,
              private configuracaoRepository: ConfiguracaoRepository,
              private router: Router, public mobileService: MobileService) {
    super(snackBar, mobileService, _loadingService)
  }

  /**
   *
   */
  ngOnInit() {
    // Requisita configuração para exibição de mensagem de agradecimento
    this.configuracaoRepository.requestConfiguracao.subscribe(configuracao => {
      this.configuracao = configuracao;
      this._loadingService.resolve('overlayStarSyntax');
    });
  }

}
