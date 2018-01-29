import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {textMasks} from '../../../../../application/controls/text-masks/text-masks';
import {AlterarMinhaSenhaComponent} from './alterar-minha-senha/alterar-minha-senha.component';
import {AuthenticationService} from '../../../../service/authentication.service';
import {Usuario} from '../../../../entity/usuario/Usuario.model';
import {Subscription} from 'rxjs/Subscription';
import {UsuarioService} from '../../../../service/usuario.service';

@Component({
  selector: 'visualizar-minha-conta',
  templateUrl: './visualizar-minha-conta.component.html',
  styleUrls: ['./visualizar-minha-conta.component.css']
})
export class VisualizarMinhaContaComponent implements OnInit, OnDestroy {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   */
  usuario: Usuario;

  /**
   *
   * @type {string}
   */
  color = 'primary';

  /**
   *
   */
  public userSubscription: Subscription;

  /**
   *
   * @param {MatDialog} dialog
   * @param {MatSnackBar} snackBar
   * @param {UsuarioService} usuarioService
   * @param {AuthenticationService} authenticationService
   */
  constructor(public dialog: MatDialog,
              public snackBar: MatSnackBar,
              public usuarioService: UsuarioService,
              public authenticationService: AuthenticationService) {
    // this.userSubscription = authenticationService
    //   .authenticatedUserChanged.subscribe((user) => {
    //     this.usuario = user;
        this.usuarioService.findUsuarioByEmail('admin@admin.com').subscribe(result => {
            this.usuario = result[0];
          });
      // });
  }

  /**
   *
   */
  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  /**
   *
   */
  ngOnInit(): void {
    this.usuarioService.findUsuarioByEmail('admin@admin.com').subscribe(result => {
      this.usuario = result[0];
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

  /**
   *
   */
  public alterarMinhaSenha() {
    this.dialog.open(AlterarMinhaSenhaComponent, {
      data: this.usuario,
    });
  }
}
