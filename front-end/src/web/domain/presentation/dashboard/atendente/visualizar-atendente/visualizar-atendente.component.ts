import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {AlterarSenhaComponent} from './alterar-senha/alterar-senha.component';
import {ConfirmDialogComponent} from '../../../controls/confirm-dialog/confirm-dialog.component';
import {UsuarioService} from '../../../../service/usuario.service';
import {UnidadeService} from '../../../../service/unidade.service';
import {Usuario} from '../../../../entity/usuario/usuario.model';
import {Colaborador} from '../../../../entity/colaborador/colaborador.model';
import {ColaboradorService} from '../../../../service/colaborador.service';
import {AuthenticationService} from '../../../../service/authentication.service';
import {Operador} from "../../../../entity/usuario/vinculo/operador.model";
import {OperadorRepository} from "../../../../repositories/operador.repository";

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
   * @type {{unidade: {}}}
   */
  public filter: any = {
    unidade: {}
  };

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
   * @param {MatSnackBar} snackBar
   * @param {OperadorRepository} operadorRepository
   * @param {Router} router
   * @param {UsuarioService} usuarioService
   * @param {ActivatedRoute} activatedRoute
   * @param {MatDialog} dialog
   * @param {AuthenticationService} authenticationService
   * @param {UnidadeService} unidadeService
   */
  constructor(private snackBar: MatSnackBar,
              private operadorRepository: OperadorRepository,
              private router: Router, private usuarioService: UsuarioService,
              public activatedRoute: ActivatedRoute, private dialog: MatDialog,
              private authenticationService: AuthenticationService, private unidadeService: UnidadeService) {
    /**
     * Pega o usuário logado
     */
    this.authenticationService.requestContaAutenticada()
      .subscribe(result => this.authenticatedUser = result);

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
    this.unidadeService.listLightByFilters(null)
      .subscribe(result => this.unidades = result.content);
  }

  /**
   *
   * @param {number} atendenteId
   */
  public find(atendenteId: number) {
    this.usuarioService.findById(atendenteId)
      .subscribe(atendente => this.atendente = atendente)
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
   */
  public remove() {
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
      if (remover)
        this.usuarioService.remove(this.atendente)
          .then(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.snackBar.open('Excluído com sucesso', 'Fechar', {
              duration: 3000
            });
          })
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
   * @param {Operador} operador
   */
  public saveOperador(operador: Operador): void {
    this.operadorRepository.save(operador)
      .then(() => {
          this.openSnackBar('Vínculo salvo com sucesso!');
      })
  }

  public removeOperador(operador: Operador): void {
    console.log(operador);
    this.operadorRepository.delete(operador.id)
      .then(() => {
        this.openSnackBar('Vínculo removido com sucesso!');
      })
  }

}
