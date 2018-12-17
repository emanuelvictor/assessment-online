import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MobileService} from '../../../service/mobile.service';
import {MatSnackBar} from '@angular/material';
import {ColaboradorService} from '../../../../../web/domain/service/colaborador.service';
import {Vinculo} from "../../../../../web/domain/entity/colaborador/vinculo.enum";

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
  atendentes: any[] = [];

  /**
   *
   */
  timeout: any;

  /**
   *
   */
  time: 30000;

  /**
   *
   * @param {Router} router
   * @param {MobileService} mobileService
   * @param {ColaboradorService} colaboradorService
   * @param {MatSnackBar} snackBar
   */
  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private mobileService: MobileService,
              private colaboradorService: ColaboradorService) {
  }

  /**
   *
   */
  ngOnInit() {

    this.timeout = setTimeout(() => {
      this.mobileService.reset();
      this.router.navigate(['/avaliar']);
    }, this.time);

    this.colaboradorService.listByFilters({unidadeId: this.mobileService.getUnidade(), vinculo: Vinculo[0]})
      .subscribe(page => {
        this.atendentes = page.content;
        if (this.atendentes.length == 1) {
          this.atendentes[0].selected = true;
          this.concluir();
        } else if (!this.atendentes.length)
          this.openSnackBar('Insira atendentes e vincule-os á unidade')
      });

  }

  /**
   *
   */
  public concluir() {
    clearTimeout(this.timeout);
    this.atendentes.forEach(colaborador => {
      if (colaborador.selected) {
        this.mobileService.addColaborador(colaborador);
      }
    });

    /**
     * TODO aumentar o timeout da toast
     */
    if (this.mobileService.getColaboradores().length > 0) {
      this.mobileService.enviarAvaliacao();
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
      this.router.navigate(['/avaliar']);
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
