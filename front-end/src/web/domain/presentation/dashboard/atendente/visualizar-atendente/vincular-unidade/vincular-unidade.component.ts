import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Usuario} from '../../../../../entity/usuario/usuario.model';
import {ColaboradorService} from '../../../../../service/colaborador.service';
import {Colaborador} from '../../../../../entity/colaborador/colaborador.model';
import {Unidade} from "../../../../../entity/unidade/unidade.model";
import {OperadorRepository} from "../../../../../repositories/operador.repository";
import {Operador} from "../../../../../entity/usuario/vinculo/operador.model";

@Component({
  selector: 'vincular-unidade',
  templateUrl: './vincular-unidade.component.html',
  styleUrls: ['./vincular-unidade.component.scss']
})
export class VincularUnidadeComponent implements OnInit {

  /**
   *
   */
  @Input()
  public unidades: any;

  /**
   *
   * @type {Unidade}
   */
  @Input()
  public filter: any = {
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
  saveOperador: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  removeOperador: EventEmitter<any> = new EventEmitter();

  /**
   *
   * @param {operadorRepository} OperadorRepository
   */
  constructor(private operadorRepository: OperadorRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    this.atendentes = [];
    for (let i = 0; i < this.unidades.length; i++)
      this.atendentes.push({
        vinculo: null,
        unidade: this.unidades[i],
        usuario: this.usuario
      });

    if (this.usuario.id)
      this.operadorRepository.listByFilters({usuarioId: this.usuario.id}).subscribe(page => {
        const result = page.content;

        if (result.length)
          for (let i = 0; i < this.atendentes.length; i++)
            for (let k = 0; k < result.length; k++)
              if (result[k].unidade.id === this.atendentes[i].unidade.id) {
                const unidadeTemp = this.atendentes[i].unidade;
                this.atendentes[i] = result[k];
                this.atendentes[i].unidade = unidadeTemp;
                if (this.atendentes[i].vinculo === 'Nenhum')
                  this.atendentes[i].vinculo = null;
              }
      });
  }

  /**
   *
   * @param {Unidade} unidade
   */
  public saveOperadorInner(unidade: Unidade): void {

    const operador: Operador = new Operador();
    operador.usuario = this.usuario;
    operador.unidade = unidade;

    if (!(unidade as any).operador)
      this.removeOperador.emit(operador);
    else
      this.saveOperador.emit(operador)

  }
}
