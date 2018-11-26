import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {Usuario} from '../../../../entity/usuario/usuario.model';
import {AuthenticationService} from '../../../../service/authentication.service';
import {UsuarioService} from '../../../../service/usuario.service';

@Component({
  selector: 'alterar-minha-conta',
  templateUrl: './alterar-minha-conta.component.html',
  styleUrls: ['./alterar-minha-conta.component.css']
})
export class AlterarMinhaContaComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Usuario}
   */
  usuario: Usuario = new Usuario();

  /**
   *
   * @param {AuthenticationService} authenticationService
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {UsuarioService} usuarioService
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(private authenticationService: AuthenticationService,
              private router: Router, private snackBar: MatSnackBar,
              private usuarioService: UsuarioService, private activatedRoute: ActivatedRoute) {
  }

  /**
   *
   */
  ngOnInit() {
    this.authenticationService.requestContaAutenticada().subscribe(result => {
      const conta = result;
      this.usuario = conta.usuario;
      delete conta.usuario.conta;
      this.usuario.conta = conta;
    });
  }

  /**
   *
   */
  public update(usuario): void {
    delete usuario.conta.usuario.conta.usuario;
    this.usuarioService.save(usuario)
      .then((usuarioResult) => {
        usuario = usuarioResult;
        this.success('Conta alterada com sucesso');
      })
  }

  /**
   *
   * @param message
   */
  public success(message: string) {
    this.openSnackBar(message);
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
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
