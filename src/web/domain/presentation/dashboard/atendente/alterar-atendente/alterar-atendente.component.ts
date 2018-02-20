import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {textMasks} from '../../../../../application/controls/text-masks/text-masks';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../../service/authentication.service';
import {UsuarioService} from '../../../../service/usuario.service';
import {Colaborador} from '../../../../entity/colaborador/Colaborador.model';

/**
 *
 */
@Component({
  selector: 'alterar-atendente',
  templateUrl: './alterar-atendente.component.html',
  styleUrls: ['./alterar-atendente.component.css']
})
export class AlterarAtendenteComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Colaborador}
   */
  colaborador: Colaborador = new Colaborador();

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {AuthenticationService} authenticationService
   * @param {ActivatedRoute} activatedRoute
   * @param {UsuarioService} usuarioService
   */
  constructor(public router: Router, public snackBar: MatSnackBar,
              public authenticationService: AuthenticationService, public activatedRoute: ActivatedRoute,
              public usuarioService: UsuarioService) {
  }

  /**
   *
   */
  ngOnInit() {
    let colaboradorKey: string = this.activatedRoute.snapshot.params['key'];
    this.find(colaboradorKey);
  }

  /**
   *
   * @param {string} colaboradorKey
   */
  public find(colaboradorKey: string) {
    this.usuarioService.findOne(colaboradorKey).subscribe(colaborador => this.colaborador = colaborador)
  }

  /**
   *
   * @param colaborador
   */
  public update(colaborador): void {
    this.usuarioService.save(colaborador).then(result => {
      if (colaborador.email && colaborador.email.length) {
        // this.authenticationService.getNativeFirebaseInstance().auth().createUserWithEmailAndPassword(colaborador.email, '123456789')
        //   .then(result => console.log(result))
        //   .catch(exception => console.log(exception));
      }

      colaborador = result;
      this.success('Atendente alterado com sucesso');
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
