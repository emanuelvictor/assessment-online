import {ActivatedRoute} from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {Usuario} from '../../../../../entity/usuario/Usuario.model';
import {AtendenteService} from '../../../../../service/atendente.service';

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
   * @param {AtendenteService} atendenteService
   */
  constructor(public activatedRoute: ActivatedRoute,
              public atendenteService: AtendenteService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.atendenteService.findAtendenteByUsuarioKey(this.usuario.key).subscribe(atendentes => {
      this.atendentes = [];
      for (let i = 0; i < atendentes.length; i++) {
        if (atendentes[i].vinculo) {
          this.atendentes.push(atendentes[i]);
        }
      }
    });
  }
}
