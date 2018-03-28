import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {UsuarioService} from '../../../../../service/usuario.service';
import {ColaboradorService} from '../../../../../service/colaborador.service';
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
    this.unidadeService.find().subscribe(unidades => {
      this.unidades = unidades;
      this.unidades.sort((a: any, b: any) => {
        if (a['media'] > b['media']) {
          return -1;
        } else if (a['media'] < b['media']) {
          return 1;
        } else {
          return 0;
        }
      });
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

