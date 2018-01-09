import {Component, OnInit} from "@angular/core";
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {AtendenteService} from "../../../../service/atendente.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Http} from "@angular/http";
import {MatSnackBar} from "@angular/material";
import {Atendente} from "../../../../entity/atendente/atendente.model";

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
   */
  constructor(public atendenteService: AtendenteService, public router: Router, public http: Http, public snackBar: MatSnackBar, public activatedRoute: ActivatedRoute) {
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
