import {Router} from "@angular/router";
import {MatDialog, MatSnackBar} from "@angular/material";
import {Component, OnInit} from "@angular/core";
import {UsuarioService} from "../../../../service/usuario.service";

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
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MatDialog} dialog
   * @param {UsuarioService} usuarioService
   */
  constructor(public router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public usuarioService: UsuarioService) {
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
    this.usuarioService.find().subscribe(result => this.atendentes = result)
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }
}