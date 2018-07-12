import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {AlterarSenhaComponent} from './alterar-senha/alterar-senha.component';
import {ConfirmDialogComponent} from '../../../controls/confirm-dialog/confirm-dialog.component';
import {UsuarioService} from '../../../../service/usuario.service';
import {UnidadeService} from '../../../../service/unidade.service';
import {Usuario} from '../../../../entity/usuario/Usuario.model';
import {Colaborador} from '../../../../entity/colaborador/Colaborador.model';
import {ColaboradorService} from '../../../../service/colaborador.service';

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
  atendente: Usuario = new Usuario();

  /**
   *
   */
  authenticatedUser: any;

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {ColaboradorService} colaboradorService
   * @param {ActivatedRoute} activatedRoute
   * @param {MatDialog} dialog
   * @param {UsuarioService} usuarioService
   * @param {UnidadeService} unidadeService
   */
  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private colaboradorService: ColaboradorService,
              public activatedRoute: ActivatedRoute, private dialog: MatDialog,
              private usuarioService: UsuarioService, private unidadeService: UnidadeService) {
    /**
     * Pega o usuário logado
     */
    this.usuarioService.getUsuarioAutenticado().subscribe(result => {
      this.authenticatedUser = result;
    });

  }

  /**
   *
   */
  ngOnInit() {
    const atendenteId: number = this.activatedRoute.snapshot.params['id'];
    this.find(atendenteId);
    this.listUnidadesByFilters();
  }

  /**
   * Consulta de unidades
   *
   */
  public listUnidadesByFilters() {
    this.unidadeService.find()
      .subscribe(result => {
        this.unidades = result;
      });
  }

  /**
   *
   * @param {number} atendenteId
   */
  public find(atendenteId: number) {
    this.usuarioService.findById(atendenteId)
      .subscribe((atendente: any) => {
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
   * @param {string} atendenteId
   */
  public remove(atendenteId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
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
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }

  /**
   *
   * @param {Colaborador} colaborador
   */
  public saveColaborador(colaborador: Colaborador = new Colaborador()): void {
    this.colaboradorService.save(colaborador)
      .then(result => {
        if (colaborador.vinculo)
          this.openSnackBar('Vínculo salvo com sucesso!');
        else
          this.openSnackBar('Vínculo removido com sucesso!')
      })
  }
}