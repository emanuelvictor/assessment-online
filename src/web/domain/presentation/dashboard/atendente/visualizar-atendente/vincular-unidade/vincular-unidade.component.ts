import {ActivatedRoute} from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {Usuario} from '../../../../../entity/usuario/Usuario.model';
import {UnidadeService} from '../../../../../service/unidade.service';
import {ColaboradorService} from "../../../../../service/colaborador.service";
import {Colaborador} from "../../../../../entity/colaborador/Colaborador.model";

@Component({
  selector: 'vincular-unidade',
  templateUrl: './vincular-unidade.component.html',
  styleUrls: ['./vincular-unidade.component.css']
})
export class VincularUnidadeComponent implements OnInit {

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
   * @param {UnidadeService} unidadeService
   * @param {ColaboradorService} colaboradorService
   */
  constructor(public activatedRoute: ActivatedRoute,
              public unidadeService: UnidadeService,
              public colaboradorService: ColaboradorService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.unidadeService.find().subscribe(unidades => {

      this.atendentes = [];
      for (let i = 0; i < unidades.length; i++) {
        this.atendentes.push({
          vinculo: 'Nenhum',
          unidade: unidades[i],
          usuario: this.usuario
        });
      }

      this.colaboradorService.findColaboradorByUsuarioKey(this.usuario.key).subscribe(result => {
        if (result.length) {

          for (let i = 0; i < this.atendentes.length; i++) {
            for (let k = 0; k < result.length; k++) {
              if (result[k].unidade.key === this.atendentes[i].unidade.key) {
                const unidadeTemp = this.atendentes[i].unidade;
                this.atendentes[i] = result[k];
                this.atendentes[i].unidade = unidadeTemp;
              }
            }
          }

        }
      });
    });
  }

  /**
   *
   * @param {Colaborador} colaborador
   */
  public save(colaborador: Colaborador = new Colaborador()): void {
    this.colaboradorService.save(colaborador);
  }
}
