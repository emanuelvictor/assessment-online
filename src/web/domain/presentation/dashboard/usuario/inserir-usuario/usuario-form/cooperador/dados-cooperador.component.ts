import {Component, Input} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {Usuario} from "../../../../../../entity/usuario/usuario.model";
import {textMasks} from "../../../../../../../application/controls/text-masks/text-masks";
import {PontoColetaService} from "../../../../../../service/ponto-coleta.service";

@Component({
  selector: 'dados-cooperador-form',
  templateUrl: './dados-cooperador.component.html',
  styleUrls: ['./dados-cooperador.component.css']
})
export class DadosCooperadorComponent {

  /**
   *
   */
  public pontoColetaSelected: any = [];

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
   * @type {Usuario}
   */
  @Input()
  public usuario: Usuario = new Usuario();

  /**
   *
   */
  constructor(public snackBar: MatSnackBar, public pontoColetaService: PontoColetaService) {
  }

  /**
   *
   */
  ngOnInit() {
    if (this.usuario && this.usuario.pontoColeta && this.usuario.pontoColeta.endereco) {
      this.pontoColetaSelected.push(this.usuario.pontoColeta);
    }
  }

  /**
   *
   * @param pontoColeta
   */
  public addPontoColeta(pontoColeta: any) {
    this.usuario.pontoColeta = pontoColeta;
  }

  /**
   *
   */
  public removePontoColeta() {
    this.usuario.pontoColeta = null;
  }

  /**
   *
   * @param {string} filter
   */
  public findPontosColeta(filter: string) {
    if (this.pontoColetaSelected.length < 1) {
      this.pontoColetaService.find(filter, null, {size: 150, page: 0, sort: null})
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
