import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from "@angular/material";
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {AlterarSenhaComponent} from "./alterar-senha/alterar-senha.component";
import {ConfirmDialogComponent} from "../../../../../application/controls/confirm-dialog/confirm-dialog.component";
import {AtendenteService} from "../../../../service/atendente.service";
import {Atendente} from "../../../../entity/atendente/atendente.model";
import {UnidadeService} from "../../../../service/unidade.service";

@Component({
  selector: 'visualizar-atendente',
  templateUrl: './visualizar-atendente.component.html',
  styleUrls: ['./visualizar-atendente.component.css']
})
export class VisualizarAtendenteComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Atendente}
   */
  atendente: Atendente;

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {ActivatedRoute} activatedRoute
   * @param {MatDialog} dialog
   * @param {AtendenteService} atendenteService
   * @param {UnidadeService} unidadeService
   */
  constructor(public router: Router,
              public snackBar: MatSnackBar,
              public activatedRoute: ActivatedRoute, public dialog: MatDialog,
              public atendenteService: AtendenteService, public unidadeService: UnidadeService) {
  }

  /**
   *
   */
  ngOnInit() {
    let atendenteKey: string = this.activatedRoute.snapshot.params['key'];
    this.find(atendenteKey);
  }

  /**
   *
   * @param {string} atendenteKey
   */
  public find(atendenteKey: string) {
    this.atendenteService.find().subscribe(atendentes => {
      for (let entry of atendentes) {
        if (entry.key === atendenteKey){
          this.atendente = entry;

          this.atendente.nome = entry.nome;
          this.atendente.email = entry.email;
          this.atendente.endereco = entry.endereco;
          this.atendente.unidade.key = entry.unidade.key;
          console.log(this.atendente);


          this.unidadeService.findOne(entry.unidade.key).subscribe(unidade => {
            console.log(unidade);
            this.atendente.unidade.key = unidade.key;
            this.atendente.unidade.nome = unidade.nome;
            this.atendente.unidade.endereco = unidade.endereco;
          })
        }
        break;
      }
    })
  }

  /**
   *
   */
  public alteraSenha() {
    this.dialog.open(AlterarSenhaComponent, {
      data: this.atendente,
    });
  }

  /**
   *
   * @param {number} atendenteKey
   */
  public remove(atendenteKey: string) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: 'Deseja realmente excluir?',
          confirm: 'Sim',
          cancel: 'Não'
        }
      }
    );

    dialogRef.afterClosed().subscribe(remover => {
      if (remover) {
        this.atendenteService.remove(atendenteKey)
          .then(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.snackBar.open('Excluído com sucesso', 'Fechar', {
              duration: 3000
            });
          })
      }
    });
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
