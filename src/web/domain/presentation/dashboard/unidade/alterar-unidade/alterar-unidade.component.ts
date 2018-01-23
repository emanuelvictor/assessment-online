import {Component, OnInit} from "@angular/core";
import {MatSnackBar} from "@angular/material";
import 'rxjs/add/operator/toPromise';
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {ActivatedRoute, Router} from "@angular/router";
import {Unidade} from "../../../../entity/unidade/Unidade.model";
import {UnidadeService} from "../../../../service/unidade.service";
import {SnapshotAction} from "angularfire2/database";

/**
 *
 */
@Component({
  selector: 'alterar-ponto-coleta',
  templateUrl: './alterar-unidade.component.html',
  styleUrls: ['./alterar-unidade.component.css']
})
export class AlterarUnidadeComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {SnapshotAction}
   */
  unidade: Unidade;

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
    let unidadeKey: string = this.activatedRoute.snapshot.params['key'];
    this.find(unidadeKey);
  }

  /**
   *
   * @param unidadeKey
   */
  public find(unidadeKey: string) {
    this.unidadeService.findOne(unidadeKey).subscribe(result => this.unidade = result)
  }

  /**
   *
   */
  public update(unidade: Unidade): void {
    this.unidadeService.update(unidade.key, unidade)
      .then((result) => {
        unidade = result;
        this.success('Unidades alterado com sucesso');
      })
  }

  /**
   *
   * @param message
   */
  public success(message: string) {
    this.openSnackBar(message);
    this.router.navigate(['dashboard/unidades/' + this.unidade.key]);
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
