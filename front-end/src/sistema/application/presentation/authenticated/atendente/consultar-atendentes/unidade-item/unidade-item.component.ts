import {Router} from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {UnidadeService} from '@src/sistema/domain/service/unidade.service';
import {Usuario} from '@src/sistema/domain/entity/usuario/usuario.model';
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'unidade-item',
  templateUrl: './unidade-item.component.html',
  styleUrls: ['./unidade-item.component.css']
})
export class UnidadeItemComponent {

  /**
   *
   */
  public colaboradores = [];

  /**
   *
   */
  @Input()
  public usuario: Usuario;

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MatDialog} dialog
   * @param {UnidadeService} unidadeService
   */
  constructor(private router: Router, private snackBar: MatSnackBar,
              private dialog: MatDialog, private unidadeService: UnidadeService) {
  }

}
