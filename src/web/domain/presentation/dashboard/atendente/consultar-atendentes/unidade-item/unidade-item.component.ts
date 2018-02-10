import {Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Component, Input, OnInit} from '@angular/core';
import {UnidadeService} from '../../../../../service/unidade.service';
import {Unidade} from '../../../../../entity/unidade/Unidade.model';
import {Atendente} from '../../../../../entity/atendente/Atendente.model';
import {AtendenteService} from '../../../../../service/atendente.service';
import {Usuario} from "../../../../../entity/usuario/Usuario.model";

@Component({
  selector: 'unidade-item',
  templateUrl: './unidade-item.component.html',
  styleUrls: ['./unidade-item.component.css']
})
export class UnidadeItemComponent implements OnInit {

  /**
   *
   */
  public atendentes = [];

  /**
   *
   */
  @Input()
  public atendente: Usuario;

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MatDialog} dialog
   * @param {UnidadeService} unidadeService
   * @param {AtendenteService} atendenteService
   */
  constructor(public router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public unidadeService: UnidadeService, public atendenteService: AtendenteService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.atendenteService.findAtendenteByUsuarioKey(this.atendente.key).subscribe(atendentes => {
      this.atendentes = [];
      for (let i = 0; i < atendentes.length; i++) {
        if (atendentes[i].vinculo) {
          this.atendentes.push(atendentes[i]);
        }
      }
    });
  }
}