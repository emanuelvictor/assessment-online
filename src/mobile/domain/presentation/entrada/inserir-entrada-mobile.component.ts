import {Component, OnInit} from "@angular/core";
import {MatSnackBar} from "@angular/material";
import 'rxjs/add/operator/toPromise';
import {ActivatedRoute, Router} from "@angular/router";
import {textMasks} from "../../../../web/application/controls/text-masks/text-masks";
import {Entrada} from "../../../../web/domain/entity/entrada/entrada.model";
import {EntradaService} from "../../../../web/domain/service/entrada.service";


/**
 *
 */
@Component({
  selector: 'inserir-entrada-mobile',
  templateUrl: 'inserir-entrada-mobile.component.html',
  styleUrls: ['inserir-entrada-mobile.component.scss']
})
export class InserirEntradaMobileComponent implements OnInit {

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
   * @param {MatSnackBar} snackBar
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(public entradaService: EntradaService, public router: Router, public snackBar: MatSnackBar, public activatedRoute: ActivatedRoute) {
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
      this.router.navigate(['inserida'], {relativeTo: this.activatedRoute});
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
