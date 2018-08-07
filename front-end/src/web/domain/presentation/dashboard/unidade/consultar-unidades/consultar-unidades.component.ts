import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {UnidadeService} from '../../../../service/unidade.service';
import {UsuarioService} from '../../../../service/usuario.service';
import {Usuario} from '../../../../entity/usuario/usuario.model';
import {Unidade} from '../../../../entity/unidade/unidade.model';

@Component({
  selector: 'consultar-unidades',
  templateUrl: './consultar-unidades.component.html',
  styleUrls: ['./consultar-unidades.component.css']
})
export class ConsultarUnidadesComponent implements OnInit {

  /**
   *
   */
  public unidades: Unidade[];

  /**
   *
   * @type {Unidade}
   */
  filter: Unidade = new Unidade();
  
  /**
   *
   */
  usuarioAutenticado: Usuario = new Usuario();

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {UnidadeService} unidadeService
   * @param {UsuarioService} usuarioService
   */
  constructor(private snackBar: MatSnackBar, private unidadeService: UnidadeService, private usuarioService: UsuarioService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.usuarioService.getUsuarioAutenticado()
      .subscribe(usuarioAutenticado => this.usuarioAutenticado = usuarioAutenticado);
    this.listUnidadesByFilters();
  }

  /**
   * Consulta de unidades
   *
   */
  public listUnidadesByFilters() {
    this.unidadeService.find()
      .subscribe(unidade => {
        this.unidades = unidade;
      });
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
}

