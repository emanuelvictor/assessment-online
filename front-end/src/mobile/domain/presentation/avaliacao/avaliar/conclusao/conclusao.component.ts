import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfiguracaoRepository} from "../../../../../../web/domain/repositories/configuracao.repository";
import {Configuracao} from "../../../../../../web/domain/entity/configuracao/configuracao.model";
import {TdLoadingService} from "@covalent/core";
import {MobileService} from "../../../../service/mobile.service";
import {Agrupador} from "../../../../../../web/domain/entity/avaliacao/agrupador.model";

@Component({
  selector: 'app-conclusao',
  templateUrl: './conclusao.component.html',
  styleUrls: ['./conclusao.component.scss']
})
export class ConclusaoComponent implements OnInit {

  /**
   *
   */
  configuracao: Configuracao;

  /**
   *
   * @param {Router} router
   * @param mobileService
   * @param activatedRoute
   * @param {TdLoadingService} _loadingService
   * @param {ConfiguracaoRepository} configuracaoRepository
   */
  constructor(private activatedRoute: ActivatedRoute,
              private _loadingService: TdLoadingService,
              private configuracaoRepository: ConfiguracaoRepository,
              private router: Router, private mobileService: MobileService) {
  }

  /**
   *
   */
  ngOnInit() {
    this._loadingService.register('overlayStarSyntax');
    this.configuracaoRepository.requestConfiguracao.subscribe(configuracao => {
      this.configuracao = configuracao;
      this._loadingService.resolve('overlayStarSyntax');
    });

    setTimeout(() => {
      // Zera o agrupador
      this.mobileService.agrupador = new Agrupador();
      this.router.navigate(['/avaliar']);
    }, 5000);
  }

}
