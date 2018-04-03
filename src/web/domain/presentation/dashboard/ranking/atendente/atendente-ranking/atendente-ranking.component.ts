import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Usuario} from '../../../../../entity/usuario/Usuario.model';
import {UsuarioService} from '../../../../../service/usuario.service';
import {UnidadeService} from '../../../../../service/unidade.service';
import {ColaboradorService} from '../../../../../service/colaborador.service';
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
              public unidadeService: UnidadeService, public colaboradorService: ColaboradorService,
              public snackBar: MatSnackBar, public dialog: MatDialog, public usuarioService: UsuarioService) {
  }

  /**
   *
   */
  ngOnInit() {
    /**
     * Pega a key da unidade que está nos parâmetros
     * @type {any}
     */
    const unidadeKey: string = this.activatedRoute.snapshot.params['key'];

    /**
     * Se houver parâmetro da key da unidade, pega somente os atendentes do usuário
     */
    if (unidadeKey)
      this.find(unidadeKey);

    /**
     * Se não houver parâmetro da key da unidade, pega todos os atendentes
     */
    else
      this.getAtendentes();
  }

  /**
   *
   */
  public getAtendentes() {
    this.usuarioService.find().subscribe(atendentes => {

      this.atendentes = atendentes;

      for (let i = 0; i < this.atendentes.length; i++)
        if (!this.atendentes[i].media)
          this.atendentes[i].media = 0;

      this.atendentes.sort((a: any, b: any) => {
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
   * @param {string} unidadeKey
   */
  public find(unidadeKey: string) {
    this.unidadeService.findOne(unidadeKey).subscribe(unidade => this.unidade = unidade);
    /**
     * TODO não precisa mais disso
     */
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
              /**
               * Se não tem média define como 0,
               * Isso é feito para não bugar a ordenação
               */
              if (!usuario.media) {
                usuario.media = 0;
              }
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

