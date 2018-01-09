import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {AuthenticationService} from "../../../../service/authentication.service";
import {AtendenteService} from "../../../../service/atendente.service";
import {Atendente} from "../../../../entity/atendente/atendente.model";

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
   * @type {Atendente}
   */
  atendente: Atendente = new Atendente();

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {AuthenticationService} authenticationService
   * @param {AtendenteService} atendenteService
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(public router: Router, public snackBar: MatSnackBar, public authenticationService: AuthenticationService, public atendenteService: AtendenteService, public activatedRoute: ActivatedRoute) {
  }

  /**
   *
   */
  ngOnInit() {
    this.getAuthenticatedUser();
  }

  /**
   *
   */
  public getAuthenticatedUser() {
    this.authenticationService.getPromiseAuthenticatedUser().then(result => {
      this.atendente = result;
    });
  }

  /**
   *
   */
  public update(atendente): void {
    this.atendenteService.update(atendente)
      .then((atendenteResult) => {
        atendente = atendenteResult;
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
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }
}