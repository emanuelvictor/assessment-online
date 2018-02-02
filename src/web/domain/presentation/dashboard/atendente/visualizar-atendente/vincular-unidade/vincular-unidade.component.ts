import {ActivatedRoute} from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {Usuario} from '../../../../../entity/usuario/Usuario.model';
import {UnidadeService} from '../../../../../service/unidade.service';
import {AtendenteService} from '../../../../../service/atendente.service';
import {Atendente} from '../../../../../entity/atendente/Atendente.model';
import {Unidade} from '../../../../../entity/unidade/Unidade.model';

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
   * @param {AtendenteService} atendenteService
   */
  constructor(public activatedRoute: ActivatedRoute,
              public unidadeService: UnidadeService,
              public atendenteService: AtendenteService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.createMatrix();
    this.listUnidadesByFilters();
  }

  /**
   * Consulta de unidades
   *
   */
  public listUnidadesByFilters() {
    this.unidadeService.find().subscribe(result => {
      this.unidades = result;
      // this.atendenteService.findAtendenteByUsuarioKey(this.usuario.key).subscribe(colaboradores => {
      //
      // });
    });
  }

  /**
   *
   * @param $event
   * @param atendente
   */
  public save($event, atendente: Atendente): void {
    console.log($event);
    atendente.isAtivo = true;

    atendente.vinculo = $event.value;

    if (!atendente.key) {
      if (atendente.vinculo)
        this.atendenteService.save(atendente);
    } else {
      if (atendente.vinculo)
        this.atendenteService.update(atendente.key, atendente);
      else
        this.atendenteService.remove(atendente.key);
    }
  }

  /**
   *
   */
  private createMatrix() {
    this.unidadeService.find().subscribe(unidades => {
      this.atendenteService.findAtendenteByUsuarioKey(this.usuario.key).subscribe(result => {
        this.atendentes = [];

        for (let i = 0; i < unidades.length; i++) {
          this.atendentes.push({
            vinculo: 'Nenhum',
            unidade: unidades[i],
            isAtivo: false,
            colaborador: this.usuario
          });
        }

        if (result.length) {
          for (let i = 0; i < this.atendentes.length; i++) {
            for (let k = 0; k < result.length; k++) {

              if (result[k].unidade.key === this.atendentes[i].unidade.key) {
                // if (atendentes[k].unidade.key === unidades[i].key){
                const unidadeTemp = this.atendentes[i].unidade;
                this.atendentes[i] = result[k];
                this.atendentes[i].unidade = unidadeTemp;
                // }
              }
            }
          }
        }
      });
    });
  }

}
