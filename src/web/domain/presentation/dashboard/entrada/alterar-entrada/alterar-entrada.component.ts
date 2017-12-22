import {Component, OnInit} from "@angular/core";
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
  selector: 'alterar-entrada',
  templateUrl: './alterar-entrada.component.html',
  styleUrls: ['./alterar-entrada.component.css']
})
export class AlterarEntradaComponent implements OnInit {

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
    let entradaId: number = this.activatedRoute.snapshot.params['id'];
    this.find(entradaId);
  }

  /**
   *
   * @param {number} entradaId
   */
  public find(entradaId: number) {
    this.entradaService.findOne(entradaId)
      .then((result) => {
        this.entrada = result;
      });
  }

  /**
   *
   */
  public update(entrada): void {
    this.entradaService.update(entrada).then(result => {
      entrada = result;
      this.success('Entrada alterada com sucesso');
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
