import {Router} from "@angular/router";
import {MatDialog, MatSnackBar} from "@angular/material";
import {Component, Input, OnInit} from "@angular/core";
import {UnidadeService} from "../../../../../service/unidade.service";
import {Unidade} from "../../../../../entity/unidade/Unidade.model";
import {Atendente} from "../../../../../entity/atendente/Atendente.model";

@Component({
  selector: 'unidade-item',
  templateUrl: './unidade-item.component.html',
  styleUrls: ['./unidade-item.component.css']
})
export class UnidadeItemComponent implements OnInit {

  /**
   *
   */
  public unidade: Unidade;

  /**
   *
   */
  @Input()
  public atendente: Atendente;

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MatDialog} dialog
   * @param {UnidadeService} unidadeService
   */
  constructor(public router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public unidadeService: UnidadeService) {
  }

  /**
   *
   */
  ngOnInit() {
    // this.unidadeService.findOne(this.atendente.unidade.key).subscribe( result=> this.unidade = result) TODO
  }
}