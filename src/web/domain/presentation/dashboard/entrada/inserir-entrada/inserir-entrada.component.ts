import {Component, OnInit} from "@angular/core";
import {Http} from "@angular/http";
import {MatSnackBar} from "@angular/material";
import 'rxjs/add/operator/toPromise';
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {ActivatedRoute, Router} from "@angular/router";
import {Entrada} from "../../../../entity/entrada/entrada.model";
import {EntradaService} from "../../../../service/entrada.service";


/**
 *
 */
@Component({
  selector: 'inserir-entrada',
  templateUrl: './inserir-entrada.component.html',
  styleUrls: ['./inserir-entrada.component.css']
})
export class InserirEntradaComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Entrada}
   */
  entrada: Entrada = new Entrada();


  /**
   *
   * @param {EntradaService} entradaService
   * @param {Router} router
   * @param {Http} http
   * @param {MatSnackBar} snackBar
   * @param {ToastyService} toastyService
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(public entradaService: EntradaService, public router: Router, public http: Http, public snackBar: MatSnackBar, public activatedRoute: ActivatedRoute) {
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
    this.entradaService.save(this.entrada).then(result => {
      this.entrada = result;
      this.success('Entrada inserida com sucesso');
    }).catch(exception => {
      this.error(exception.message);
    });
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
