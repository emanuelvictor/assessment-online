import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Usuario} from '../../../../../entity/usuario/usuario.model';
import {UnidadeService} from '../../../../../service/unidade.service';
import {ColaboradorService} from '../../../../../service/colaborador.service';
import {Colaborador} from '../../../../../entity/colaborador/colaborador.model';
import {Unidade} from "../../../../../entity/unidade/unidade.model";

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
   * @type {Unidade}
   */
  @Input()
  public filter : any = {
    unidade: {}
  };

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
   */
  @Output()
  save: EventEmitter<any> = new EventEmitter();

  /**
   *
   * @param {UnidadeService} unidadeService
   * @param {ColaboradorService} colaboradorService
   */
  constructor(private unidadeService: UnidadeService,
              private colaboradorService: ColaboradorService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.unidadeService.listLightByFilters(null)
      .subscribe(page => {
        const unidades = page.content;

        this.atendentes = [];
        for (let i = 0; i < unidades.length; i++) {
          this.atendentes.push({
            vinculo: 'Nenhum',
            unidade: unidades[i],
            usuario: this.usuario
          });
        }

        this.colaboradorService.listByFilters({usuarioId: this.usuario.id}).subscribe(page => {
          const result = page.content;
          if (result.length) {

            for (let i = 0; i < this.atendentes.length; i++) {
              for (let k = 0; k < result.length; k++) {
                if (result[k].unidade.id === this.atendentes[i].unidade.id) {
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
  public saveColaborador(colaborador: Colaborador = new Colaborador()): void {
    this.save.emit(colaborador);
  }
}
