import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MobileService} from '../../../service/mobile.service';
import {UnidadeService} from '../../../../../web/domain/service/unidade.service';
import {Unidade} from "../../../../../web/domain/entity/unidade/unidade.model";

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
   * @param {MobileService} mobileService
   * @param {UnidadeService} unidadeService
   */
  constructor(private router: Router,
              private mobileService: MobileService,
              private unidadeService: UnidadeService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.unidadeService.find()
      .subscribe(page => {
        this.unidades = page.content;
      });
  }


  /**
   *
   * @param unidade
   */
  selecionar(unidade: Unidade) {
    this.mobileService.setUnidade(unidade.id);
    this.router.navigate(['avaliar']);
  }
}
