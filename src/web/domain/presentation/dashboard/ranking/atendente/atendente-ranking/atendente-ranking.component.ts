import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {calcularMedia, Usuario} from '../../../../../entity/usuario/Usuario.model';
import {UsuarioService} from '../../../../../service/usuario.service';
import {UnidadeService} from '../../../../../service/unidade.service';
import {ColaboradorService} from '../../../../../service/colaborador.service';
import {AvaliacaoService} from '../../../../../service/avaliacao.service';
import {Unidade} from '../../../../../entity/unidade/Unidade.model';

@Component({
  selector: 'atendente-ranking',
  templateUrl: './atendente-ranking.component.html',
  styleUrls: ['./atendente-ranking.component.css']
})
export class AtendenteRankingComponent implements OnInit {

  /**
   *
   * @type {Unidade}
   */
  unidade: Unidade;

  /**
   *
   * @type {Usuario}
   */
  atendentes: Usuario[];

  /**
   *
   * @param {Router} router
   * @param {ActivatedRoute} activatedRoute
   * @param {UnidadeService} unidadeService
   * @param {ColaboradorService} colaboradorService
   * @param {MatSnackBar} snackBar
   * @param {MatDialog} dialog
   * @param {UsuarioService} usuarioService
   */
  constructor(public router: Router, public activatedRoute: ActivatedRoute,
              public unidadeService: UnidadeService, public colaboradorService: ColaboradorService, private avaliacaoService: AvaliacaoService,
              public snackBar: MatSnackBar, public dialog: MatDialog, public usuarioService: UsuarioService) {
  }

  /**
   *
   */
  ngOnInit() {
    const unidadeKey: string = this.activatedRoute.snapshot.params['key'];
    this.find(unidadeKey);
  }

  /**
   *
   * @param {string} unidadeKey
   */
  public find(unidadeKey: string) {
    this.unidadeService.findOne(unidadeKey).subscribe(unidade => this.unidade = unidade);
    this.colaboradorService.listColaboradoresByUnidadeKey(unidadeKey).subscribe(colaboradores => {
      this.atendentes = [];
      colaboradores.forEach(colaborador => {
        this.usuarioService.findOne(colaborador.usuario.key).subscribe(usuario => {
          if (colaborador.vinculo && colaborador.vinculo !== 'Operador') {

            let founded = false;

            for (let i = 0; i < this.atendentes.length; i++)
              if (this.atendentes[i].key === usuario.key) {
                this.atendentes[i] = usuario;
                founded = true;
              }

            if (!founded) {
              this.atendentes.push(usuario);
            }

            this.atendentes.sort((a: any, b: any) => {
              if (a['media'] > b['media']) {
                return -1;
              } else if (a['media'] < b['media']) {
                return 1;
              } else {
                return 0;
              }
            });
          }
        })
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

