import {Component, OnInit} from "@angular/core";
import {Http} from "@angular/http";
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
  selector: 'inserir-ficha',
  templateUrl: './inserir-ficha.component.html',
  styleUrls: ['./inserir-ficha.component.css']
})
export class InserirFichaComponent implements OnInit {

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
   * @param {Http} http
   * @param {MatSnackBar} snackBar
   * @param {ToastyService} toastyService
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(public fichaService: FichaService, public router: Router, public http: Http, public snackBar: MatSnackBar, public activatedRoute: ActivatedRoute) {
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
    this.fichaService.save(this.ficha).then(result => {
      this.ficha = result;
      this.success('Ficha inserida com sucesso');
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
  public openSnackBar(message: string) {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }
}
