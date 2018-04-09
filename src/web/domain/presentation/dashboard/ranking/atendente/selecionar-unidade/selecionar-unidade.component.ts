import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Unidade} from '../../../../../entity/unidade/Unidade.model';

@Component({
  selector: 'selecionar-unidade',
  templateUrl: './selecionar-unidade.component.html',
  styleUrls: ['./selecionar-unidade.component.css']
})
export class SelecionarUnidadeComponent implements OnInit {

  /**
   *
   * @type {Unidade}
   */
  filter: Unidade = new Unidade();

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MatDialog} dialog
   */
  constructor(public router: Router, public snackBar: MatSnackBar, public dialog: MatDialog) {
  }

  /**
   *
   */
  ngOnInit() {
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

