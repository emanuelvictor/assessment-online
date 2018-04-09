import {MatSnackBar} from '@angular/material';
import {Component, OnInit} from '@angular/core';
import {UsuarioService} from '../../../../service/usuario.service';
import {Usuario} from '../../../../entity/usuario/Usuario.model';

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
   */
  constructor(private snackBar: MatSnackBar, private usuarioService: UsuarioService) {
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
}
