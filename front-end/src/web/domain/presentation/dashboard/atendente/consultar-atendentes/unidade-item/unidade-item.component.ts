import {Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Component, Input, OnInit} from '@angular/core';
import {UnidadeService} from '../../../../../service/unidade.service';
import {Usuario} from "../../../../../entity/usuario/usuario.model";

@Component({
  selector: 'unidade-item',
  templateUrl: './unidade-item.component.html',
  styleUrls: ['./unidade-item.component.css']
})
export class UnidadeItemComponent implements OnInit {

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

  /**
   *
   */
  ngOnInit() {
    // this.colaboradorService.listColaboradoresByUsuarioKey(this.usuario.key).subscribe(colaboradores => {
    //   this.colaboradores = [];
    //   for (let i = 0; i < colaboradores.length; i++) {
    //     if (colaboradores[i].vinculo) {
    //       this.colaboradores.push(colaboradores[i]);
    //     }
    //   }
    // });
  }
}