import {Component, Input} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {textMasks} from "../../../../../../../application/controls/text-masks/text-masks";
import {UnidadeService} from "../../../../../../service/unidade.service";
import {Atendente} from "../../../../../../entity/atendente/atendente.model";

@Component({
  selector: 'dados-cooperador-form',
  templateUrl: './dados-cooperador.component.html',
  styleUrls: ['./dados-cooperador.component.css']
})
export class DadosCooperadorComponent {

  /**
   *
   */
  public unidadeSelected: any = [];

  /**
   *
   */
  public pontosColetaList: any[];

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Atendente}
   */
  @Input()
  public atendente: Atendente = new Atendente();

  /**
   *
   */
  constructor(public snackBar: MatSnackBar, public unidadeService: UnidadeService) {
  }

  /**
   *
   */
  ngOnInit() {
    if (this.atendente && this.atendente.unidade && this.atendente.unidade.endereco) {
      this.unidadeSelected.push(this.atendente.unidade);
    }
  }

  /**
   *
   * @param unidade
   */
  public addUnidade(unidade: any) {
    this.atendente.unidade = unidade;
  }

  /**
   *
   */
  public removeUnidade() {
    this.atendente.unidade = null;
  }

  /**
   *
   * @param {string} filter
   */
  public findPontosColeta(filter: string) {
    if (this.unidadeSelected.length < 1) {
      this.unidadeService.find(filter, null, {size: 150, page: 0, sort: null})
        .then((result) => {
          this.pontosColetaList = result.content;
        })
    }
    else {
      this.pontosColetaList = [];
    }
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
