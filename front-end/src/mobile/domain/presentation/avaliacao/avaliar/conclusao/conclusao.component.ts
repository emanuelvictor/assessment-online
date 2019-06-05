import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ConfiguracaoRepository} from "../../../../../../web/domain/repositories/configuracao.repository";
import {Configuracao} from "../../../../../../web/domain/entity/configuracao/configuracao.model";
import {TdLoadingService} from "@covalent/core";
import {Agrupador} from "../../../../../../web/domain/entity/avaliacao/agrupador.model";
import {MobileService} from "../../../../service/mobile.service";

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
   * @param {TdLoadingService} _loadingService
   * @param {ConfiguracaoRepository} configuracaoRepository
   */
  constructor(private router: Router,
              private mobileService: MobileService,
              private _loadingService: TdLoadingService,
              private configuracaoRepository: ConfiguracaoRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    this._loadingService.register('overlayStarSyntax');
    this.configuracaoRepository.configuracao.subscribe(configuracao => {
      this.configuracao = configuracao;
      this._loadingService.resolve('overlayStarSyntax');
    });

    setTimeout(() => {
      // Zera o agrupador
      this.mobileService.agrupador = new Agrupador();
      this.router.navigate(['/avaliar/1']);
    }, 5000);
  }

}
