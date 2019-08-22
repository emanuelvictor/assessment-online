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
import {Unidade} from "../../../../entity/unidade/unidade.model";
import {UnidadeTipoAvaliacaoRepository} from "../../../../repository/unidade-tipo-avaliacao.repository";
import {UnidadeTipoAvaliacaoDispositivoRepository} from "../../../../repository/unidade-tipo-avaliacao-dispositivo.repository";

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
  public unidades: Unidade[];

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
   */
  vincularUnidadeTipoAvaliacaoDispositivo: boolean;

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param unidadeTipoAvaliacaoRepository
   * @param {OperadorRepository} operadorRepository
   * @param {AvaliavelRepository} avaliavelRepository
   * @param {Router} router
   * @param {UsuarioService} usuarioService
   * @param {ActivatedRoute} activatedRoute
   * @param {MatDialog} dialog
   * @param unidadeTipoAvaliacaoDispositivoRepository
   * @param {AuthenticationService} authenticationService
   * @param {UnidadeService} unidadeService
   */
  constructor(private avaliavelRepository: AvaliavelRepository,
              private router: Router, private usuarioService: UsuarioService,
              public activatedRoute: ActivatedRoute, private dialog: MatDialog,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository,
              private operadorRepository: OperadorRepository, private snackBar: MatSnackBar,
              private unidadeTipoAvaliacaoDispositivoRepository: UnidadeTipoAvaliacaoDispositivoRepository,
              private authenticationService: AuthenticationService, private unidadeService: UnidadeService) {
    /**
     * Pega o usuário logado
     */
    this.authenticationService.requestContaAutenticada()
      .subscribe(result => this.authenticatedUser = result)

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
   * @param {number} id
   */
  public find(id: number) {

    this.unidadeService.listLightByFilters({withBondFilter: true}).subscribe(result => {
      this.unidades = result.content;

      this.operadorRepository.listByFilters({usuarioId: id}).subscribe(result => {
        this.operadores = result.content;

        if (this.operadores.length)
          for (let i = 0; i < this.unidades.length; i++)
            for (let k = 0; k < this.operadores.length; k++)
              if (this.operadores[k].unidade.id === this.unidades[i].id) {
                (this.unidades[i] as any).operadorValue = true;
                (this.unidades[i] as any).operador = this.operadores[k]
              }
      });

      this.avaliavelRepository.listByFilters({usuarioId: id}).subscribe(result => {
        this.avaliaveis = result.content;

        for (let i = 0; i < this.unidades.length; i++) {
          if (!this.unidades[i].unidadesTiposAvaliacoes || !this.unidades[i].unidadesTiposAvaliacoes.length) {
            this.unidadeTipoAvaliacaoRepository.listByFilters({
              unidadeId: this.unidades[i].id,
              ativo: true
            }).subscribe(result => {
              this.unidades[i].unidadesTiposAvaliacoes = result.content;
              for (let c = 0; c < this.unidades[i].unidadesTiposAvaliacoes.length; c++)
                this.unidadeTipoAvaliacaoDispositivoRepository.listByUnidadeTipoAvaliacaoId({unidadeTipoAvaliacaoId: this.unidades[i].unidadesTiposAvaliacoes[c].id}).subscribe(result => {
                  this.unidades[i].unidadesTiposAvaliacoes[c].unidadesTiposAvaliacoesDispositivo = result.content
                });

              for (let k = 0; k < this.avaliaveis.length; k++)
                if (this.avaliaveis[k].unidadeTipoAvaliacao.unidade.id === this.unidades[i].id) {
                  (this.unidades[i] as any).avaliavelValue = this.avaliaveis[k].ativo;
                  this.avaliaveis[k].unidadeTipoAvaliacao.avaliavel = (this.avaliaveis[k]);
                  this.unidades[i].unidadesTiposAvaliacoes.push(this.avaliaveis[k].unidadeTipoAvaliacao)
                }
            })
          }
        }

        this.vincularUnidadeTipoAvaliacaoDispositivo = this.unidades.length && (this.unidades.length > 1 || (this.unidades.length === 1 && (this.unidades[0].unidadesTiposAvaliacoes && this.unidades[0].unidadesTiposAvaliacoes.length > 1 || (this.unidades[0].unidadesTiposAvaliacoes.length === 1 && (this.unidades[0].unidadesTiposAvaliacoes[0].unidadesTiposAvaliacoesDispositivo && this.unidades[0].unidadesTiposAvaliacoes[0].unidadesTiposAvaliacoesDispositivo.length > 1)))));

        this.usuarioService.findById(id).subscribe(result => {
          this.atendente = result
        })
      })
    })
  }

  /**
   *
   */
  public alteraSenha() {
    this.dialog.open(AlterarSenhaComponent, {
      data: this.atendente
    })
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
            })
          })
    })
  }

  /**
   *
   * @param message
   */
  public error(message: string) {
    this.openSnackBar(message)
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    })
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
            (this.unidades[i] as any).operador = operador;

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
