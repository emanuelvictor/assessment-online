import {Component, OnInit} from "@angular/core";
import {Http} from "@angular/http";
import {MatSnackBar} from "@angular/material";
import 'rxjs/add/operator/toPromise';
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {Router} from "@angular/router";
import {PontoColeta} from "../../../../entity/ponto-coleta/ponto-coleta.model";
import {PontoColetaService} from "../../../../service/ponto-coleta.service";


/**
 *
 */
@Component({
  selector: 'inserir-ponto-coleta',
  templateUrl: './inserir-ponto-coleta.component.html',
  styleUrls: ['./inserir-ponto-coleta.component.css']
})
export class InserirPontoColetaComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {PontoColeta}
   */
  pontoColeta: PontoColeta = new PontoColeta();

  /**
   *
   * @param {PontoColetaService} pontoColetaService
   * @param {Router} router
   * @param {Http} http
   * @param {MatSnackBar} snackBar
   * @param {ToastyService} toastyService
   */
  constructor(public pontoColetaService: PontoColetaService, public router: Router, public http: Http, public snackBar: MatSnackBar) {
  }

  /**
   *
   */
  ngOnInit() {
  }

  /**
   *
   */
  public save(): void {
    this.pontoColetaService.save(this.pontoColeta).then(result => {
      this.pontoColeta = result;
      this.success('Ponto de coleta inserido com sucesso');
    });
  }

  /**
   *
   * @param message
   */
  public success(message: string) {
    this.openSnackBar(message);
    this.router.navigate(['/dashboard/pontos-coleta']);
  }

  /**
   *
   * @param message
   */
  public error(message: string) {
    this.openSnackBar(message);
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
