import {Component, OnInit} from "@angular/core";
import {MatSnackBar} from "@angular/material";
import 'rxjs/add/operator/toPromise';
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {ActivatedRoute, Router} from "@angular/router";
import {PontoColeta} from "../../../../entity/ponto-coleta/ponto-coleta.model";
import {PontoColetaService} from "../../../../service/ponto-coleta.service";

/**
 *
 */
@Component({
  selector: 'alterar-ponto-coleta',
  templateUrl: './alterar-ponto-coleta.component.html',
  styleUrls: ['./alterar-ponto-coleta.component.css']
})
export class AlterarPontoColetaComponent implements OnInit {

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
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {ActivatedRoute} activatedRoute
   * @param {PontoColetaService} pontoColetaService
   */
  constructor(public router: Router, public snackBar: MatSnackBar,
              public activatedRoute: ActivatedRoute,
              public pontoColetaService: PontoColetaService) {
  }

  /**
   *
   */
  ngOnInit() {
    let pontoColetaId: number = this.activatedRoute.snapshot.params['id'];
    this.find(pontoColetaId);
  }

  /**
   *
   * @param pontoColetaId
   */
  public find(pontoColetaId: number) {
    this.pontoColetaService.findOne(pontoColetaId)
      .then((result) => {
        this.pontoColeta = result;
      });
  }

  /**
   *
   */
  public update(pontoColeta): void {
    this.pontoColetaService.update(pontoColeta)
      .then((result) => {
        pontoColeta = result;

        this.success('Pontos de coleta alterado com sucesso');
      })
  }

  /**
   *
   * @param message
   */
  public success(message: string) {
    this.openSnackBar(message);

    this.router.navigate(['dashboard/pontos-coleta/' + this.pontoColeta.id]);

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
