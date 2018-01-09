import {Component, OnInit} from "@angular/core";
import {MatSnackBar} from "@angular/material";
import 'rxjs/add/operator/toPromise';
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {ActivatedRoute, Router} from "@angular/router";
import {Unidade} from "../../../../entity/unidade/unidade.model";
import {UnidadeService} from "../../../../service/unidade.service";

/**
 *
 */
@Component({
  selector: 'alterar-ponto-coleta',
  templateUrl: './alterar-atendente.component.html',
  styleUrls: ['./alterar-atendente.component.css']
})
export class AlterarUnidadeComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Unidade}
   */
  unidade: Unidade = new Unidade();

  /**
   *
   * @param {ActivatedRoute} activatedRoute
   * @param {UnidadeService} unidadeService
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   */
  constructor(public activatedRoute: ActivatedRoute,
              public unidadeService: UnidadeService,
              public router: Router, public snackBar: MatSnackBar) {
  }

  /**
   *
   */
  ngOnInit() {
    let unidadeId: number = this.activatedRoute.snapshot.params['id'];
    this.find(unidadeId);
  }

  /**
   *
   * @param unidadeId
   */
  public find(unidadeId: number) {
    this.unidadeService.findOne(unidadeId)
      .then((result) => {
        this.unidade = result;
      });
  }

  /**
   *
   */
  public update(unidade): void {
    this.unidadeService.update(unidade)
      .then((result) => {
        unidade = result;

        this.success('Pontos de coleta alterado com sucesso');
      })
  }

  /**
   *
   * @param message
   */
  public success(message: string) {
    this.openSnackBar(message);

    this.router.navigate(['dashboard/pontos-coleta/' + this.unidade.id]);

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
