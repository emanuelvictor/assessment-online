import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';

@Component({
  selector: 'atendente-ranking',
  templateUrl: './atendente-ranking.component.html',
  styleUrls: ['./atendente-ranking.component.css']
})
export class AtendenteRankingComponent implements OnInit {

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

