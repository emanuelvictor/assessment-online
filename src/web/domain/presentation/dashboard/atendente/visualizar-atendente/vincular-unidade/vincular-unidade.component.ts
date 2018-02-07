import {ActivatedRoute} from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {Usuario} from '../../../../../entity/usuario/Usuario.model';
import {UnidadeService} from '../../../../../service/unidade.service';
import {AtendenteService} from '../../../../../service/atendente.service';
import {Atendente} from '../../../../../entity/atendente/Atendente.model';
import {Unidade} from '../../../../../entity/unidade/Unidade.model';
import {Vinculo} from '../../../../../entity/atendente/Vinculo.enum';

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
  public save(atendente: Atendente = new Atendente()): void {
    this.atendenteService.save(atendente);
  }

  /**
   *
   */
  private createMatrix() {
    this.unidadeService.find().subscribe(unidades => {

      this.atendenteService.findAtendenteByUsuarioKey(this.usuario.key).toPromise().then(result => {

        console.log('aqui');
        this.atendentes = [];

        for (let i = 0; i < unidades.length; i++) {
          this.atendentes.push({
            vinculo: 'Nenhum',
            unidade: unidades[i],
            colaborador: this.usuario
          });
        }

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

}
