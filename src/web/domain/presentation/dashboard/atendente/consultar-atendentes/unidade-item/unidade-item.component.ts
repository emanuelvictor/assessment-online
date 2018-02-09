import {Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Component, Input, OnInit} from '@angular/core';
import {UnidadeService} from '../../../../../service/unidade.service';
import {Unidade} from '../../../../../entity/unidade/Unidade.model';
import {Atendente} from '../../../../../entity/atendente/Atendente.model';
import {AtendenteService} from '../../../../../service/atendente.service';

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
  public atendente: Atendente;

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
    this.atendenteService.findAtendenteByUsuarioKey(this.atendente.key).subscribe(result => {
      this.atendentes = result;
    });
  }
}