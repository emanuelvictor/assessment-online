import {Router} from "@angular/router";
import {MatDialog, MatSnackBar} from "@angular/material";
import {Component, OnInit} from "@angular/core";
import {AtendenteService} from "../../../../service/atendente.service";
import {Atendente} from "../../../../entity/atendente/atendente.model";

@Component({
  selector: 'consultar-atendentes',
  templateUrl: './consultar-atendentes.component.html',
  styleUrls: ['./consultar-atendentes.component.css']
})
export class ConsultarAtendentesComponent implements OnInit {

  /**
   *
   */
  public atendentes: Atendente[];

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MatDialog} dialog
   * @param {AtendenteService} atendenteService
   */
  constructor(public router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public atendenteService: AtendenteService) {
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
    this.atendenteService.find().subscribe(atendentes => this.atendentes = atendentes)
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