import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {MatDialog, MatIconRegistry, MatSnackBar} from '@angular/material';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {AvaliacaoService} from "../../../../service/avaliacao.service";
import {Avaliacao} from "../../../../entity/avaliacao/avaliacao.model";
import {DomSanitizer} from "@angular/platform-browser";
import {AuthenticationService} from "../../../../service/authentication.service";
import {viewAnimation} from "../../../controls/utils";
import {ConfirmDialogComponent} from "../../../controls/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'visualizar-avaliacao',
  templateUrl: './visualizar-avaliacao.component.html',
  styleUrls: ['./visualizar-avaliacao.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class VisualizarAvaliacaoComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Avaliacao}
   */
  avaliacao: Avaliacao = new Avaliacao();

  /**
   *
   */
  contaAutenticada: any;

  /**
   *
   * @param activatedRoute
   * @param avaliacaoService
   * @param authenticationService
   * @param iconRegistry
   * @param domSanitizer
   * @param snackBar
   * @param router
   * @param dialog
   */
  constructor(public activatedRoute: ActivatedRoute,
              private avaliacaoService: AvaliacaoService,
              private authenticationService: AuthenticationService,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
              private snackBar: MatSnackBar, private router: Router, private dialog: MatDialog,) {

    this.iconRegistry.addSvgIconInNamespace('assets', 'pessimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/pessimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'regular', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/regular.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'bom', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/bom.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'otimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/otimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'media', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/baseline-bar_chart-24px.svg'));

  }

  /**
   *
   */
  ngOnInit() {
    this.contaAutenticada = this.authenticationService.contaAutenticada;
    const avaliacaoId: number = this.activatedRoute.snapshot.params['id'];
    this.find(avaliacaoId);
  }

  /**
   *
   * @param {number} avaliacaoId
   */
  public find(avaliacaoId: number) {
    this.avaliacaoService.findById(avaliacaoId)
      .subscribe((avaliacao: Avaliacao) => {
          this.avaliacao = avaliacao;
          this.avaliacao.atendentes = avaliacao.avaliacoesAvaliaveis.map(avaliacaoAvaliavel => ' ' + avaliacaoAvaliavel.avaliavel.usuario.nome).join();
        }
      )
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
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }

  /**
   *
   */
  public remove(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: 'Remover esta avaliação?',
          confirm: 'Sim',
          cancel: 'Não'
        }
      }
    );

    dialogRef.afterClosed().subscribe(remover => {
      if (remover) {
        this.avaliacaoService.delete(id)
          .then(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.snackBar.open('Excluído com sucesso', 'Fechar', {
              duration: 3000
            });
          })
      }
    });
  }
}
