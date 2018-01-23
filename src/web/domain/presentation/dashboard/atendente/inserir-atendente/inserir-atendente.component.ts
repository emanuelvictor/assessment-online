import {Component, OnInit} from "@angular/core";
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {AtendenteService} from "../../../../service/usuario.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Http} from "@angular/http";
import {MatSnackBar} from "@angular/material";
import {Atendente} from "../../../../entity/atendente/atendente.model";
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase';
import {environment} from "../../../../../../environments/environment";
import {AuthenticationService} from "../../../../service/authentication.service";

@Component({
  selector: 'inserir-atendente',
  templateUrl: './inserir-atendente.component.html',
  styleUrls: ['./inserir-atendente.component.css']
})
export class InserirAtendenteComponent implements OnInit {

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
   * @param {AtendenteService} atendenteService
   * @param {Router} router
   * @param {Http} http
   * @param {MatSnackBar} snackBar
   * @param {ActivatedRoute} activatedRoute
   * @param {AuthenticationService} authenticationService
   */
  constructor(public atendenteService: AtendenteService, public router: Router, public http: Http, public snackBar: MatSnackBar, public activatedRoute: ActivatedRoute, private authenticationService: AuthenticationService) {
  }

  /**
   *
   */
  ngOnInit() {
    // this.atendente.perfil = 'COOPERADOR';
  }

  /**
   *
   */
  public save(): void {
    this.atendenteService.save(this.atendente).then(result => {

      if (this.atendente.email && this.atendente.email.length) {
        this.authenticationService.getNativeFirebaseInstance().auth().createUserWithEmailAndPassword(this.atendente.email, '123456789')
          .then(result => console.log(result))
          .catch(exception => console.log(exception));
      }

      // TODO WHATA???
      this.atendente = result;
      this.success('Usuário inserido com sucesso');
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
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }
}
