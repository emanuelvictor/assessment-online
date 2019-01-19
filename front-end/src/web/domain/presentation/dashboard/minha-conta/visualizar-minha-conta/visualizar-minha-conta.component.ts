import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {AlterarMinhaSenhaComponent} from './alterar-minha-senha/alterar-minha-senha.component';
import {AuthenticationService} from '../../../../service/authentication.service';
import {Usuario} from '../../../../entity/usuario/usuario.model';
import {Subscription} from 'rxjs';
import {UnidadeService} from "../../../../service/unidade.service";
import {OperadorRepository} from "../../../../repositories/operador.repository";
import {AvaliavelRepository} from "../../../../repositories/avaliavel.repository";
import {viewAnimation} from "../../../controls/utils";

@Component({
  selector: 'visualizar-minha-conta',
  templateUrl: './visualizar-minha-conta.component.html',
  styleUrls: ['./visualizar-minha-conta.component.css'],
  animations: [
    viewAnimation
  ]
})
export class VisualizarMinhaContaComponent implements OnInit, OnDestroy {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   */
  usuario: Usuario;

  /**
   *
   */
  public unidades: any;

  /**
   *
   */
  public operadores: any;

  /**
   *
   */
  public avaliaveis: any;

  /**
   *
   * @type {string}
   */
  color = 'primary';

  /**
   *
   */
  public userSubscription: Subscription;

  /**
   *
   * @param {MatDialog} dialog
   * @param {MatSnackBar} snackBar
   * @param {AuthenticationService} authenticationService
   * @param {UnidadeService} unidadeService
   * @param {OperadorRepository} operadorRepository
   * @param {AvaliavelRepository} avaliavelRepository
   */
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar,
              private authenticationService: AuthenticationService, private unidadeService: UnidadeService,
              private operadorRepository: OperadorRepository, private avaliavelRepository: AvaliavelRepository) {
  }

  /**
   *
   */
  ngOnInit(): void {
    this.authenticationService.requestContaAutenticada().subscribe(conta => {
      conta.usuario.conta = conta;
      this.usuario = conta.usuario;

      this.unidadeService.listByUsuarioId({usuarioId: this.usuario.id}).subscribe(result => {
        this.unidades = result;

        this.operadorRepository.listByFilters({usuarioId: this.usuario.id}).subscribe(page => {
          this.operadores = page.content;

          if (this.operadores.length)
            for (let i = 0; i < this.unidades.length; i++)
              for (let k = 0; k < this.operadores.length; k++)
                if (this.operadores[k].unidade.id === this.unidades[i].id) {
                  this.unidades[i].operadorValue = true;
                  this.unidades[i].operador = this.operadores[k];
                }
        });

        this.avaliavelRepository.listByFilters({usuarioId: this.usuario.id}).subscribe(page => {
          this.avaliaveis = page.content;
          for (let i = 0; i < this.unidades.length; i++) {
            if (!this.unidades[i].unidadesTiposAvaliacoes)
              this.unidades[i].unidadesTiposAvaliacoes = [];
            for (let k = 0; k < this.avaliaveis.length; k++)

              if (this.avaliaveis[k].unidadeTipoAvaliacao.unidade.id === this.unidades[i].id) {
                this.unidades[i].avaliavelValue = this.avaliaveis[k].ativo;
                this.avaliaveis[k].unidadeTipoAvaliacao.avaliavel = (this.avaliaveis[k]);
                this.unidades[i].unidadesTiposAvaliacoes.push(this.avaliaveis[k].unidadeTipoAvaliacao);
              }
          }
        });

      });

    })
  }

  /**
   *
   */
  ngOnDestroy(): void {
    if (this.userSubscription)
      this.userSubscription.unsubscribe();
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
  public alterarMinhaSenha() {
    this.dialog.open(AlterarMinhaSenhaComponent, {
      data: this.usuario,
    });
  }
}
