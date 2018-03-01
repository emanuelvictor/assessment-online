import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {AlterarSenhaComponent} from './alterar-senha/alterar-senha.component';
import {ConfirmDialogComponent} from '../../../controls/confirm-dialog/confirm-dialog.component';
import {UsuarioService} from '../../../../service/usuario.service';
import {UnidadeService} from '../../../../service/unidade.service';
import {Usuario} from '../../../../entity/usuario/Usuario.model';

@Component({
  selector: 'visualizar-atendente',
  templateUrl: './visualizar-atendente.component.html',
  styleUrls: ['./visualizar-atendente.component.scss']
})
export class VisualizarAtendenteComponent implements OnInit {

  /**
   *
   */
  public unidades: any;

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Usuario}
   */
  atendente: Usuario;

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {ActivatedRoute} activatedRoute
   * @param {MatDialog} dialog
   * @param {UsuarioService} usuarioService
   * @param {UnidadeService} unidadeService
   */
  constructor(public router: Router,
              public snackBar: MatSnackBar,
              public activatedRoute: ActivatedRoute, public dialog: MatDialog,
              public usuarioService: UsuarioService, public unidadeService: UnidadeService) {
  }

  /**
   *
   */
  ngOnInit() {
    let atendenteKey: string = this.activatedRoute.snapshot.params['key'];
    this.find(atendenteKey);
    this.listUnidadesByFilters();
  }

  /**
   * Consulta de unidades
   *
   */
  public listUnidadesByFilters() {
    this.unidadeService.find().subscribe(result => {
      this.unidades = result;
    });
  }

  /**
   *
   * @param {string} atendenteKey
   */
  public find(atendenteKey: string) {
    this.usuarioService.findOne(atendenteKey).subscribe(atendente => {
      this.atendente = atendente;
    })
  }

  /**
   *
   */
  public alteraSenha() {
    this.dialog.open(AlterarSenhaComponent, {
      data: this.atendente,
    });
  }

  /**
   *
   * @param {number} atendenteKey
   */
  public remove(atendenteKey: string) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: 'Deseja realmente excluir?',
          confirm: 'Sim',
          cancel: 'Não'
        }
      }
    );

    dialogRef.afterClosed().subscribe(remover => {
      if (remover) {
        this.usuarioService.remove(this.atendente)
          .then(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.snackBar.open('Excluído com sucesso', 'Fechar', {
              duration: 3000
            });
          })
      }
    });
  }

  /**
   *
   * @param message
   */
  public error(message: string) {
    this.openSnackBar(message);
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }
}
