import {MatSnackBar} from '@angular/material';
import {Component, OnInit} from '@angular/core';
import {UsuarioService} from '../../../../service/usuario.service';
import {Usuario} from '../../../../entity/usuario/Usuario.model';
import {UnidadeService} from "../../../../service/unidade.service";

@Component({
  selector: 'consultar-atendentes',
  templateUrl: './consultar-atendentes.component.html',
  styleUrls: ['./consultar-atendentes.component.css']
})
export class ConsultarAtendentesComponent implements OnInit {

  /**
   *
   */
  public atendentes: any[];

  /**
   *
   * @type {Usuario}
   */
  filter: Usuario = new Usuario();

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {UsuarioService} usuarioService
   * @param {UnidadeService} unidadeService
   */
  constructor(private snackBar: MatSnackBar, private usuarioService: UsuarioService, private unidadeService: UnidadeService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.listUsuariosByFilters();
  }

  /**
   *
   */
  public listUsuariosByFilters() {
    this.usuarioService.find().subscribe(atendentes => {
      this.atendentes = atendentes;
      this.atendentes.forEach(atendente => {
        /**
         * TODO Substituir por innerjoins
         */
        this.unidadeService.listUnidadesByColaboradorKey(atendente.key)
          .subscribe(unidades => {
            atendente.unidades = unidades.map(unidade => unidade.nome).join();
          })
      })
    })
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }

  // objects: any[] = [
  //   {id: 1, city: 'San Diego', population: '4M'},
  //   {id: 2, city: 'San Franscisco', population: '6M'},
  //   {id: 3, city: 'Los Angeles', population: '5M'},
  //   {id: 4, city: 'Austin', population: '3M'},
  //   {id: 5, city: 'New York City', population: '10M'},
  // ];
  //
  // filteredObjects: string[];
  //
  // objectsModel: string[] = this.unidades.slice(0, 2);
  //
  // filterObjects(value: string): void {
  //   this.filteredObjects = this.unidades.filter((obj: any) => {
  //     if (value) {
  //       return obj.city.toLowerCase().indexOf(value.toLowerCase()) > -1;
  //     } else {
  //       return false;
  //     }
  //   }).filter((filteredObj: any) => {
  //     return this.objectsModel ? this.objectsModel.indexOf(filteredObj) < 0 : true;
  //   });
  // }

}
