import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {MobileService} from "../../../../service/mobile.service";
import {AvaliavelRepository} from "../../../../../../web/domain/repositories/avaliavel.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../../web/domain/repositories/unidade-tipo-avaliacao.repository";

@Component({
  selector: 'selecionar-atendentes',
  templateUrl: './selecionar-atendentes.component.html',
  styleUrls: ['./selecionar-atendentes.component.scss']
})
export class SelecionarAtendentesComponent implements OnInit {

  /**
   *
   * @type {Array}
   */
  avaliaveis: any[] = [];

  /**
   *
   */
  unidadeTipoAvaliacao: any;

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
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MobileService} mobileService
   * @param {ActivatedRoute} activatedRoute
   * @param {AvaliavelRepository} avaliavelRepository
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   */
  constructor(private router: Router,
              private snackBar: MatSnackBar,
              public mobileService: MobileService,
              public activatedRoute: ActivatedRoute,
              private avaliavelRepository: AvaliavelRepository,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {
  }

  /**
   *
   */
  ngOnInit() {

    if (this.mobileService.unidadesTiposAvaliacoes && this.mobileService.unidadesTiposAvaliacoes.length) {

      const local = this.mobileService.getUnidadeTipoAvaliacaoByIndex(this.activatedRoute.snapshot.params['ordem']);

      if (!local)
        this.router.navigate(['selecionar-avaliacao']);

      this.unidadeTipoAvaliacaoRepository.findById(local.id)
        .subscribe(result => this.unidadeTipoAvaliacao = result)

    }

    this.timeout = setTimeout(() => {
      this.mobileService.reset();
      this.router.navigate(['/avaliar/1']);
    }, this.time);

    this.avaliavelRepository.listByFilters(
      {
        unidadeTipoAvaliacaoId: this.mobileService.unidadesTiposAvaliacoes.filter(unidadeTipoAvaliacao => unidadeTipoAvaliacao.ordem === this.activatedRoute.snapshot.params['ordem'])[0].id
      }
    )
      .subscribe(page => {
        this.avaliaveis = page.content;
        if (this.avaliaveis.length === 1) {
          this.avaliaveis[0].selected = true;
          this.concluir();
        } else if (!this.avaliaveis.length) {
          this.openSnackBar('Vincule atendnetes, itens ou quesitos á essa unidade nessa avaliação');
          this.router.navigate(['conclusao'])
        }
      });

  }

  /**
   *
   */
  public concluir() {
    clearTimeout(this.timeout);
    this.avaliaveis.forEach(avaliavel => {
      if (avaliavel.selected) {
        this.mobileService.addAvaliavel(avaliavel);
      }
    });

    /**
     * TODO aumentar o timeout da toast
     */
    if (this.mobileService.getAvaliaveis().length > 0) {
      this.mobileService.enviarAvaliacao();

      if (this.mobileService.unidadesTiposAvaliacoes.length !== +this.activatedRoute.snapshot.params['ordem'])
        this.router.navigate(['avaliar/' + (+this.activatedRoute.snapshot.params['ordem'] + 1)]);
      else
        this.router.navigate(['conclusao']);
    } else {
      this.snackBar.open('Selecione ao menos um atendente', 'Fechar', this.mobileService.getSnackBarConfig());
    }
  }

  /**
   *
   */
  public clearTimeout() {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.mobileService.reset();
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
