import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {AlterarMinhaSenhaComponent} from './alterar-minha-senha/alterar-minha-senha.component';
import {AuthenticationService} from '../../../../service/authentication.service';
import {Usuario} from '../../../../entity/usuario/usuario.model';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute} from '@angular/router';
import {FileRepository} from '../../../../../infrastructure/repository/file/file.repository';
import {ContaService} from '../../../../service/conta.service';
import {UsuarioService} from "../../../../service/usuario.service";

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
   * @param {MatDialog} dialog
   * @param {MatSnackBar} snackBar
   * @param {ContaService} contaService
   * @param {ActivatedRoute} activatedRoute
   * @param {FileRepository} fileRepository
   * @param {UsuarioService} usuarioService
   * @param {AuthenticationService} authenticationService
   */
  constructor(public dialog: MatDialog,
              public snackBar: MatSnackBar,
              public contaService: ContaService,
              public activatedRoute: ActivatedRoute,
              public fileRepository: FileRepository,
              private usuarioService: UsuarioService,
              public authenticationService: AuthenticationService) {
  }

  /**
   *
   */
  public userSubscription: Subscription;

  /**
   *
   */
  ngOnInit(): void {
    this.contaService.findUsuarioByEmail(this.authenticationService.getAuthenticatedUser().email)
      .subscribe(result => {
        this.usuarioService.findById(result.usuario.id)
          .subscribe((usuario: Usuario) => {
            this.usuario = usuario;
          })
      });
  }

  /**
   *
   */
  ngOnDestroy(): void {
    if (this.userSubscription)
      this.userSubscription.unsubscribe();
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
