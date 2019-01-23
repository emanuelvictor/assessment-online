import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MobileService} from '../../../service/mobile.service';
import {UnidadeService} from '../../../../../web/domain/service/unidade.service';
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'selecionar-unidade',
  templateUrl: './selecionar-unidade.component.html',
  styleUrls: ['./selecionar-unidade.component.scss']
})
export class SelecionarUnidadeComponent implements OnInit {

  /**
   *
   */
  model: any;

  /**
   *
   */
  unidades: any;

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MobileService} mobileService
   * @param {UnidadeService} unidadeService
   */
  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private mobileService: MobileService,
              private unidadeService: UnidadeService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.consultarUnidades();
  }

  /**
   *
   */
  consultarUnidades() {
    this.unidadeService.listLightByFilters(null)
      .subscribe(result => {
        this.unidades = result.content;
        if (this.unidades.length == 1)
          this.selecionar(this.unidades[0]);
        else if (!this.unidades.length)
          this.openSnackBar('Insira unidades de atendimento pela plataforma web')
      });
  }

  /**
   *
   * @param unidade
   */
  selecionar(unidade) {
    this.mobileService.setUnidadeId(unidade.id);

    this.mobileService.setHashsByUnidadeId(unidade.id);

    this.router.navigate(['selecionar-avaliacao']);
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
