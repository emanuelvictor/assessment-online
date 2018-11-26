import {Component, OnInit} from "@angular/core";
import {MatSnackBar} from "@angular/material";
// import 'rxjs/add/operator/toPromise';
import {textMasks} from "../../../controls/text-masks/text-masks";
import {Router} from "@angular/router";
import {Unidade} from "../../../../entity/unidade/unidade.model";
import {UnidadeService} from "../../../../service/unidade.service";


/**
 *
 */
@Component({
  selector: 'inserir-unidade',
  templateUrl: './inserir-unidade.component.html',
  styleUrls: ['./inserir-unidade.component.css']
})
export class InserirUnidadeComponent implements OnInit {

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
   * @param {UnidadeService} unidadeService
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   */
  constructor(private  unidadeService: UnidadeService, private  router: Router, private  snackBar: MatSnackBar) {
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
    this.unidadeService.save(this.unidade).then(result => {
      this.success('Unidade inserido com sucesso');
    });
  }

  /**
   *
   * @param message
   */
  public success(message: string) {
    this.openSnackBar(message);
    this.router.navigate(['/dashboard/unidades']);
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
