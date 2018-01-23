import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {textMasks} from '../../../../../application/controls/text-masks/text-masks';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../../service/authentication.service';
import {AtendenteService} from '../../../../service/usuario.service';
import {Atendente} from '../../../../entity/atendente/atendente.model';

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
   * @type {Atendente}
   */
  atendente: Atendente = new Atendente();

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {AuthenticationService} authenticationService
   * @param {ActivatedRoute} activatedRoute
   * @param {AtendenteService} atendenteService
   */
  constructor(public router: Router, public snackBar: MatSnackBar,
              public authenticationService: AuthenticationService, public activatedRoute: ActivatedRoute,
              public atendenteService: AtendenteService) {
  }

  /**
   *
   */
  ngOnInit() {
    let atendenteKey: string = this.activatedRoute.snapshot.params['key'];
    this.find(atendenteKey);
  }

  /**
   *
   * @param {string} atendenteKey
   */
  public find(atendenteKey: string) {
    this.atendenteService.findOne(atendenteKey).subscribe(atendente => this.atendente = atendente)
  }

  /**
   *
   * @param atendente
   */
  public update(atendente): void {
    this.atendenteService.update(atendente.key, atendente).then(result => {
      if (atendente.email && atendente.email.length) {
        this.authenticationService.getNativeFirebaseInstance().auth().createUserWithEmailAndPassword(atendente.email, '123456789')
          .then(result => console.log(result))
          .catch(exception => console.log(exception));
      }

      atendente = result;
      this.success('Usuário alterado com sucesso');
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
