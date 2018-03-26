import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'selecionar-ranking',
  templateUrl: './selecionar-ranking.component.html',
  styleUrls: ['./selecionar-ranking.component.css']
})
export class SelecionarRankingComponent implements OnInit {

  /**
   *
   */
  public unidades: any;


  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   */
  constructor(public router: Router, public snackBar: MatSnackBar) {
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

