import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ConfiguracaoRepository} from "../../../../../web/domain/repositories/configuracao.repository";
import {Configuracao} from "../../../../../web/domain/entity/configuracao/configuracao.model";
import {TdLoadingService} from "@covalent/core";

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
   * @param {TdLoadingService} _loadingService
   * @param {ConfiguracaoRepository} configuracaoRepository
   */
  constructor(private router: Router,
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
      this.router.navigate(['/avaliar/1']);
    }, 5000);
  }

}
