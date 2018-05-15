import {ActivatedRoute} from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {Usuario} from '../../../../../entity/usuario/Usuario.model';
import {ColaboradorService} from '../../../../../service/colaborador.service';

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
   * @param {ColaboradorService} colaboradorService
   */
  constructor(public activatedRoute: ActivatedRoute,
              public colaboradorService: ColaboradorService) {
  }

  /**
   *
   */
  ngOnInit() {
    // this.colaboradorService.listOperadoresByUsuarioKey(this.usuario.key).subscribe(atendentes => {
    //   console.log(atendentes);
    //   this.atendentes = atendentes;
    // });
  }
}
