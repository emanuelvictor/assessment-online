import {ActivatedRoute} from '@angular/router';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Usuario} from '../../../../../entity/usuario/usuario.model';
import {UnidadeService} from '../../../../../service/unidade.service';
import {ColaboradorService} from '../../../../../service/colaborador.service';
import {Colaborador} from '../../../../../entity/colaborador/colaborador.model';
import {AuthenticationService} from '../../../../../service/authentication.service';

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
   */
  @Output()
  save: EventEmitter<any> = new EventEmitter();

  /**
   *
   * @param {ActivatedRoute} activatedRoute
   * @param {UnidadeService} unidadeService
   * @param {ColaboradorService} colaboradorService
   * @param {AuthenticationService} authenticationService
   */
  constructor(public activatedRoute: ActivatedRoute,
              public unidadeService: UnidadeService,
              public colaboradorService: ColaboradorService,
              public authenticationService: AuthenticationService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.unidadeService.listByFilters(null)
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
