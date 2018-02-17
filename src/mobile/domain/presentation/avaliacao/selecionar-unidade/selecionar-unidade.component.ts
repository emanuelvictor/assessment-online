import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AvaliacaoService} from '../AvaliacaoService';
import {UnidadeService} from "../../../../../web/domain/service/unidade.service";

@Component({
  selector: 'app-selecionar-unidade',
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
   * @param {AvaliacaoService} avaliacaoService
   * @param {UnidadeService} unidadeService
   */
  constructor(private router: Router, private avaliacaoService: AvaliacaoService, private unidadeService: UnidadeService) {
    this.unidadeService.find().subscribe(unidades => {
      console.log(unidades);
      this.unidades = unidades;
    });
  }

  /**
   *
   */
  ngOnInit() {
    // this.unidadeService.find().subscribe(unidades => {
    //   this.avaliacaoService.setUnidades(unidades);
    //   if (this.avaliacaoService.getUnidade() != null) {
    //     this.router.navigate(['avaliar']);
    //   }
    // });
  }

  /**
   *
   * @param unidade
   */
  selecionar(unidade) {
    this.avaliacaoService.setUnidade(unidade);
    this.router.navigate(['avaliar']);
  }
}
