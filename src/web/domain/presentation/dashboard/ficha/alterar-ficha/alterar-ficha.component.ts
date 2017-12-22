import {Component, OnInit} from "@angular/core";
import {MatSnackBar} from "@angular/material";
import 'rxjs/add/operator/toPromise';
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {ActivatedRoute, Router} from "@angular/router";
import {Ficha} from "../../../../entity/fornecedor/ficha.model";
import {FichaService} from "../../../../service/ficha.service";


/**
 *
 */
@Component({
  selector: 'alterar-ficha',
  templateUrl: './alterar-ficha.component.html',
  styleUrls: ['./alterar-ficha.component.css']
})
export class AlterarFichaComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Ficha}
   */
  ficha: Ficha = new Ficha();


  /**
   *
   * @param {FichaService} fichaService
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(public fichaService: FichaService, public router: Router, public snackBar: MatSnackBar, public activatedRoute: ActivatedRoute) {
  }

  /**
   *
   */
  ngOnInit() {
    let fichaId: number = this.activatedRoute.snapshot.params['id'];
    this.find(fichaId);
  }

  /**
   *
   * @param {number} fichaId
   */
  public find(fichaId: number) {
    this.fichaService.findOne(fichaId)
      .then((result) => {
        this.ficha = result;
      });
  }

  /**
   *
   */
  public update(ficha): void {
    this.fichaService.update(ficha).then(result => {
      ficha = result;
      this.success('Ficha alterada com sucesso');
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
