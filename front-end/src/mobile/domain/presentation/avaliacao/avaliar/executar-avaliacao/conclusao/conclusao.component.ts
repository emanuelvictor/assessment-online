import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfiguracaoRepository} from "../../../../../../../web/domain/repositories/configuracao.repository";
import {TdLoadingService} from "@covalent/core";
import {MobileService} from "../../../../../service/mobile.service";
import {AbstractComponent} from "../abstract/abstract.component";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-conclusao',
  templateUrl: './conclusao.component.html',
  styleUrls: ['./conclusao.component.scss']
})
export class ConclusaoComponent extends AbstractComponent implements OnInit {

  /**
   *
   * @param snackBar
   * @param {Router} router
   * @param mobileService
   * @param activatedRoute
   * @param {TdLoadingService} _loadingService
   */
  constructor(public snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute,
              public _loadingService: TdLoadingService,
              private router: Router, public mobileService: MobileService) {
    super(snackBar, mobileService, _loadingService)
  }

  /**
   *
   */
  ngOnInit() {
    // Workarround
    // Tempo de espera padrão para concluir o timeout.
    // Isso se reflete na experiência do usuário
    setTimeout(() => {
      this._loadingService.resolve('overlayStarSyntax')
    }, 300)
  }

}
