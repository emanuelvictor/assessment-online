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

  matrix = [[]];

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
   * @param unidadeKey
   * @param usuarioKey
   */
  public save($event, unidadeKey, usuarioKey): void {

    const atendente: Atendente = new Atendente();

    atendente.unidade = new Unidade();
    atendente.colaborador = new Usuario();

    atendente.unidade.key = unidadeKey;
    atendente.colaborador.key = usuarioKey;

    atendente.isAtivo = true;

    atendente.vinculo = $event.value;

    this.atendenteService.save(atendente);
  }

  private createMatrix() {
    this.unidadeService.find().subscribe(unidades => {
      this.atendenteService.findAtendenteByUsuarioKey(this.usuario.key).toPromise().then(atendentes => {
        console.log('asdfa');
        for (let i = 0; i < unidades.length; i++) {
          // this.matrix[i] = [];
          for (let k = 0; k < unidades.length; k++) {
            if (atendentes[k] /*&& atendentes[k].unidade.key === unidades[i].key*/){
              // if (atendentes[k].unidade.key === unidades[i].key){
                this.matrix[i][k] = atendentes[k];
                this.matrix[i][k].unidade = unidades.filter( (value, index, array) => value.key === this.matrix[i][k].unidade.key)[0];
              // }
            } else {
              this.matrix[i][k] = {
                vinculo : 'Nenhum',
                unidade : unidades[k],
                isAtivo : false,
                colaborador : this.usuario
              }
            }
          }
        }
      }).catch(exception => console.log('pau'));
    });
  }

}
