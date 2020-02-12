import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {Usuario} from '@src/sistema/domain/entity/usuario/usuario.model';
import {AuthenticationService} from '@src/sistema/domain/service/authentication.service';
import {UsuarioService} from '@src/sistema/domain/service/usuario.service';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';

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
   * @param {ToastService} toastService
   * @param {UsuarioService} usuarioService
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(private authenticationService: AuthenticationService,
              private router: Router, private toastService: ToastService,
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
    this.toastService.open(message, 'Fechar', {
      duration: 5000
    });
  }
}
