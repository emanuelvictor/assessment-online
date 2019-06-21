import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {AlterarSenhaComponent} from './alterar-senha/alterar-senha.component';
import {ConfirmDialogComponent} from '../../../controls/confirm-dialog/confirm-dialog.component';
import {UsuarioService} from '../../../../service/usuario.service';
import {UnidadeService} from '../../../../service/unidade.service';
import {Usuario} from '../../../../entity/usuario/usuario.model';
import {AuthenticationService} from '../../../../service/authentication.service';
import {viewAnimation} from "../../../controls/utils";
import {Avaliavel} from "../../../../entity/usuario/vinculo/avaliavel.model";
import {OperadorRepository} from "../../../../repository/operador.repository";
import {AvaliavelRepository} from "../../../../repository/avaliavel.repository";

@Component({
  selector: 'visualizar-atendente',
  templateUrl: './visualizar-atendente.component.html',
  styleUrls: ['./visualizar-atendente.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class VisualizarAtendenteComponent implements OnInit {

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
   */
  masks = textMasks;

  /**
   *
   * @type {{unidade: {}}}
   */
  public filter: any = {
    unidade: {}
  };

  /**
   *
   * @type {Usuario}
   */
  atendente: Usuario = new Usuario();

  /**
   *
   */
  authenticatedUser: any;

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {OperadorRepository} operadorRepository
   * @param {AvaliavelRepository} avaliavelRepository
   * @param {Router} router
   * @param {UsuarioService} usuarioService
   * @param {ActivatedRoute} activatedRoute
   * @param {MatDialog} dialog
   * @param {AuthenticationService} authenticationService
   * @param {UnidadeService} unidadeService
   */
  constructor(private snackBar: MatSnackBar,
              private operadorRepository: OperadorRepository,
              private avaliavelRepository: AvaliavelRepository,
              private router: Router, private usuarioService: UsuarioService,
              public activatedRoute: ActivatedRoute, private dialog: MatDialog,
              private authenticationService: AuthenticationService, private unidadeService: UnidadeService) {
    /**
     * Pega o usuário logado
     */
    this.authenticationService.requestContaAutenticada()
      .subscribe(result => this.authenticatedUser = result);

  }

  /**
   *
   */
  ngOnInit() {
    const atendenteId: number = this.activatedRoute.snapshot.params['id'];
    this.find(atendenteId);
  }

  /**
   *
   * @param {number} atendenteId
   */
  public find(atendenteId: number) {
    this.usuarioService.findById(atendenteId).subscribe(atendente => {

      this.unidadeService.listLightByFilters({withBondFilter: true}).subscribe(result => {
        this.unidades = result.content;

        this.operadorRepository.listByFilters({usuarioId: atendenteId}).subscribe(page => {
          this.operadores = page.content;

          if (this.operadores.length)
            for (let i = 0; i < this.unidades.length; i++)
              for (let k = 0; k < this.operadores.length; k++)
                if (this.operadores[k].unidade.id === this.unidades[i].id) {
                  this.unidades[i].operadorValue = true;
                  this.unidades[i].operador = this.operadores[k];
                }
        });

        this.avaliavelRepository.listByFilters({usuarioId: atendenteId}).subscribe(page => {
          this.avaliaveis = page.content;
          for (let i = 0; i < this.unidades.length; i++) {
            if (!this.unidades[i].unidadesTiposAvaliacoes)
              LocalStorage.unidadesTiposAvaliacoes = [];
            for (let k = 0; k < this.avaliaveis.length; k++)
              if (this.avaliaveis[k].unidadeTipoAvaliacao.unidade.id === this.unidades[i].id) {
                this.unidades[i].avaliavelValue = this.avaliaveis[k].ativo;
                this.avaliaveis[k].unidadeTipoAvaliacao.avaliavel = (this.avaliaveis[k]);
                this.unidades[i].unidadesTiposAvaliacoes.push(this.avaliaveis[k].unidadeTipoAvaliacao);
              }
          }
        });

        this.atendente = atendente;

      });

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
   */
  public remove() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: 'Você perderá todas as avaliações deste ítem, inclusive aquelas vinculadas as unidades. Deseja realmente excluir?',
          confirm: 'Sim',
          cancel: 'Não'
        }
      }
    );

    dialogRef.afterClosed().subscribe(remover => {
      if (remover)
        this.usuarioService.remove(this.atendente)
          .then(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.snackBar.open('Excluído com sucesso', 'Fechar', {
              duration: 3000
            });
          })
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
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }

  /**
   *
   * @param operador
   */
  public saveOperador(operador): void {
    this.operadorRepository.save(operador)
      .then(result => {
        operador = result;

        for (let i = 0; i < this.unidades.length; i++)
          if (this.unidades[i].id === operador.unidade.id)
            this.unidades[i].operador = operador;

        this.openSnackBar('Vínculo salvo com sucesso!');
      })
  }

  /**
   *
   * @param operador
   */
  public removeOperador(operador): void {
    this.operadorRepository.delete(operador.id)
      .then(() => {
        this.openSnackBar('Vínculo removido com sucesso!');
      })
  }

  /**
   *
   * @param avaliavel
   */
  public saveAvaliavel(avaliavel): void {

    const aux = new Avaliavel();
    aux.unidadeTipoAvaliacao = avaliavel.unidadeTipoAvaliacao;
    aux.usuario = avaliavel.usuario;
    aux.id = avaliavel.id;
    aux.ativo = avaliavel.ativo;
    delete (aux.unidadeTipoAvaliacao as any).avaliavel;

    this.avaliavelRepository.save(aux)
      .then(result => {
        avaliavel = result;
        this.openSnackBar('Vínculo salvo com sucesso!');

        // Se não tiiver nenhum avaliavel na lista
        if (!this.avaliaveis || !this.avaliaveis.length) {
          this.avaliaveis = [];
          this.avaliaveis.push(this.avaliaveis);
        }

        // Se tiver avaliaveis
        else
          for (let i = 0; i < this.avaliaveis.length; i++)
            if (this.avaliaveis[i].id === avaliavel.id) {
              this.avaliaveis[i] = avaliavel;
              return;
            }

            // Não encontrou no array coloca no último
            else if (i === this.avaliaveis.length - 1) {
              this.avaliaveis.push(avaliavel);
              return;
            }

      })
  }

  /**
   *
   * @param avaliavel
   */
  public removeAvaliavel(avaliavel): void {

    const aux = new Avaliavel();
    aux.unidadeTipoAvaliacao = avaliavel.unidadeTipoAvaliacao;
    aux.usuario = avaliavel.usuario;
    aux.id = avaliavel.id;
    aux.ativo = avaliavel.ativo;
    delete (aux.unidadeTipoAvaliacao as any).avaliavel;

    this.avaliavelRepository.save(aux)
      .then(result => {
        this.openSnackBar('Vínculo removido com sucesso!');

        avaliavel = result;

        // Se não tiiver nenhum avaliavel na lista
        if (!this.avaliaveis || !this.avaliaveis.length) {
          this.avaliaveis = [];
          this.avaliaveis.push(this.avaliaveis);
        }

        // Se tiver avaliáveis
        else
          for (let i = 0; i < this.avaliaveis.length; i++)
            if (this.avaliaveis[i].id === avaliavel.id) {
              this.avaliaveis[i] = avaliavel;
              return;
            }

            // Não encontrou no array coloca no último
            else if (i === this.avaliaveis.length - 1) {
              this.avaliaveis.push(avaliavel);
              return;
            }

      })
  }

}
