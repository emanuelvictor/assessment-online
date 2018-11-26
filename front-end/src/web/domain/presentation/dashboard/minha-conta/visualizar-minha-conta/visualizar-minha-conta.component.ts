import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {AlterarMinhaSenhaComponent} from './alterar-minha-senha/alterar-minha-senha.component';
import {AuthenticationService} from '../../../../service/authentication.service';
import {Usuario} from '../../../../entity/usuario/usuario.model';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {FileRepository} from '../../../../../infrastructure/repository/file/file.repository';
import {ContaService} from '../../../../service/conta.service';

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
   * @param {ContaService} contaService
   * @param {ActivatedRoute} activatedRoute
   * @param {FileRepository} fileRepository
   * @param {AuthenticationService} authenticationService
   */
  constructor(public dialog: MatDialog,
              public snackBar: MatSnackBar,
              public contaService: ContaService,
              public activatedRoute: ActivatedRoute,
              public fileRepository: FileRepository,
              public authenticationService: AuthenticationService) {
  }

  /**
   *
   */
  ngOnInit(): void {
    this.authenticationService.requestContaAutenticada().subscribe(conta => {
      conta.usuario.conta = conta;
      this.usuario = conta.usuario;
    })
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
