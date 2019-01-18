import {ActivatedRoute} from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {Usuario} from '../../../../../entity/usuario/usuario.model';
import {OperadorRepository} from "../../../../../repositories/operador.repository";

@Component({
  selector: 'visualizar-vinculo-unidade',
  templateUrl: './visualizar-vinculo-unidade.component.html',
  styleUrls: ['./visualizar-vinculo-unidade.component.css']
})
export class VisualizarVinculoUnidadeComponent implements OnInit {

  /**
   *
   */
  public unidades: any;

  /**
   *
   * @type {Array}
   */
  public atendentes = [];

  /**
   *
   */
  @Input()
  usuario: Usuario;

  /**
   *
   * @param {ActivatedRoute} activatedRoute
   * @param {OperadorRepository} operadorRepository
   */
  constructor(public activatedRoute: ActivatedRoute,
              public operadorRepository: OperadorRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    this.operadorRepository.listByFilters({usuarioId: this.usuario.id}).subscribe(page => {
      this.atendentes = page.content;
    });
  }
}
