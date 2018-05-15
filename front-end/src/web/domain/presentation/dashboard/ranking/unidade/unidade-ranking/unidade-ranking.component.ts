import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {UnidadeService} from '../../../../../service/unidade.service';
import {Unidade} from '../../../../../entity/unidade/Unidade.model';

@Component({
  selector: 'unidade-ranking',
  templateUrl: './unidade-ranking.component.html',
  styleUrls: ['./unidade-ranking.component.css']
})
export class UnidadeRankingComponent implements OnInit {


  /**
   *
   * @type {Unidade}
   */
  unidades: Unidade[];

  /**
   *
   * @type {Unidade}
   */
  filter: Unidade = new Unidade();

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {UnidadeService} unidadeService
   */
  constructor(private snackBar: MatSnackBar,
              private unidadeService: UnidadeService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.find();
  }

  /**
   *
   */
  public find() {
    this.unidadeService.find().then(unidades => {

      this.unidades = unidades;

      /**
       * Insere média zero para unidades sem média
       */
      for (let i = 0; i < this.unidades.length; i++)
        if (!this.unidades[i].media)
          this.unidades[i].media = 0;

      this.unidades.sort((a: any, b: any) => {
        if (a['media'] > b['media']) {
          return -1;
        } else if (a['media'] < b['media']) {
          return 1;
        } else {
          return 0;
        }
      });

      for (let i = 0; i < this.unidades.length; i++){
        this.unidades[i].posicao = i + 1;
      }

    });
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

