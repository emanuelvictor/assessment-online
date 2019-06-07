import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TdLoadingService} from "@covalent/core";
import {MobileService} from "../../../../../service/mobile.service";
import {AbstractComponent} from "../abstract/abstract.component";
import {MatSnackBar} from "@angular/material";
import {AgrupadorRepository} from "../../../../../repository/agrupador.repository";
import {Agrupador} from "../../../../../../../web/domain/entity/avaliacao/agrupador.model";
import {Avaliacao} from "../../../../../../../web/domain/entity/avaliacao/avaliacao.model";

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
   * @param agrupadorRepository
   * @param mobileService
   * @param activatedRoute
   * @param {TdLoadingService} _loadingService
   */
  constructor(public snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute,
              public _loadingService: TdLoadingService,
              private agrupadorRepository: AgrupadorRepository,
              private router: Router, public mobileService: MobileService) {
    super(snackBar, mobileService, _loadingService)
  }

  /**
   *
   */
  ngOnInit() {
    const agrupador: Agrupador = Object.assign({}, this.mobileService.avaliacoes[+this.activatedRoute.snapshot.params.ordem - 1].agrupador);

    this.mobileService.avaliacoes.forEach(value => value.agrupador = null);

    agrupador.avaliacoes = this.mobileService.avaliacoes;

    agrupador.avaliacoes.forEach(avaliacao => {
      const copy: Avaliacao = Object.assign({}, avaliacao);
      copy.avaliacoesAvaliaveis = [];
      avaliacao.avaliacoesAvaliaveis.forEach(avaliacaoAvaliavel => {
        avaliacaoAvaliavel.avaliacao = copy;
      })
    });

    console.log(agrupador);

    // Salva o agrupador, e as avaliações com seus avaliaveis por cascade.
    this.agrupadorRepository.save(agrupador).then(() => {
      this._loadingService.resolve('overlayStarSyntax')
    })
    // // Workarround
    // // Tempo de espera padrão para concluir o timeout.
    // // Isso se reflete na experiência do usuário
    // setTimeout(() => {
    //   this._loadingService.resolve('overlayStarSyntax')
    // }, 300)
  }

}
