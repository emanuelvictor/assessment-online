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
import {OperadorRepository} from '../../../../repository/operador.repository';
import {AvaliavelRepository} from '../../../../repository/avaliavel.repository';
import {Unidade} from '../../../../entity/unidade/unidade.model';
import {UnidadeTipoAvaliacaoRepository} from '../../../../repository/unidade-tipo-avaliacao.repository';
import {UnidadeTipoAvaliacaoDispositivo} from '../../../../entity/avaliacao/unidade-tipo-avaliacao-dispositivo.model';
import {UnidadeTipoAvaliacaoDispositivoRepository} from '../../../../repository/unidade-tipo-avaliacao-dispositivo.repository';
import {viewAnimation} from '../../../controls/utils';

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
    this.usuarioService.findById(id).subscribe(usuario => {

      this.avaliavelRepository.listByFilters({usuarioId: id}).subscribe(result => {
        this.avaliaveis = result.content;

        this.unidadeService.listLightByFilters({withBondFilter: true}).subscribe(result => {
          this.unidades = result.content;

          this.operadorRepository.listByFilters({usuarioId: id}).subscribe(result => {
            this.operadores = result.content;

            if (this.operadores.length) {
              for (let i = 0; i < this.unidades.length; i++) {
                for (let k = 0; k < this.operadores.length; k++) {
                  if (this.operadores[k].unidade.id === this.unidades[i].id) {
                    (this.unidades[i] as any).operadorValue = true;
                    (this.unidades[i] as any).operador = this.operadores[k]
                  }
                }
              }
            }
          });


          for (let i = 0; i < this.unidades.length; i++) {
            this.unidadeTipoAvaliacaoRepository.listByFilters({
              unidadeId: this.unidades[i].id,
              ativo: true
            }).subscribe(result => {

              this.unidades[i].unidadesTiposAvaliacoes = result.content;

              this.unidades[i].unidadesTiposAvaliacoes.map(unidadeTipoAvaliacao => {
                (unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoDispositivo = new UnidadeTipoAvaliacaoDispositivo(false)
              });

              for (let c = 0; c < this.unidades[i].unidadesTiposAvaliacoes.length; c++) {
                this.unidadeTipoAvaliacaoDispositivoRepository.listByUnidadeTipoAvaliacaoId({
                  unidadeTipoAvaliacaoId: this.unidades[i].unidadesTiposAvaliacoes[c].id,
                  ativo: true
                }).subscribe(result => {
                  this.unidades[i].unidadesTiposAvaliacoes[c].unidadesTiposAvaliacoesDispositivo = result.content;

                  for (let k = 0; k < this.avaliaveis.length; k++) {
                    if (this.avaliaveis[k].unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.id === this.unidades[i].id) {
                      (this.unidades[i] as any).avaliavelValue = this.avaliaveis.filter(a => a.ativo && a.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.id === this.unidades[i].id).length > 0;
                    }

                    for (let kinner = 0; kinner < this.unidades[i].unidadesTiposAvaliacoes[c].unidadesTiposAvaliacoesDispositivo.length; kinner++) {
                      if (this.avaliaveis[k].unidadeTipoAvaliacaoDispositivo.id === this.unidades[i].unidadesTiposAvaliacoes[c].unidadesTiposAvaliacoesDispositivo[kinner].id) {
                        (this.unidades[i].unidadesTiposAvaliacoes[c].unidadesTiposAvaliacoesDispositivo[kinner] as any).unidadeTipoAvaliacaoDispositivoValue = this.avaliaveis[k].ativo;
                        (this.unidades[i].unidadesTiposAvaliacoes[c] as any).unidadeTipoAvaliacaoValue = this.avaliaveis[k].ativo
                      }
                    }
                  }

                  if (!this.vincularUnidadeTipoAvaliacaoDispositivo) {
                    this.vincularUnidadeTipoAvaliacaoDispositivo = this.unidades.length && (this.unidades.length > 1 || (this.unidades.length === 1 && (this.unidades[i].unidadesTiposAvaliacoes && this.unidades[i].unidadesTiposAvaliacoes.length > 1 || (this.unidades[i].unidadesTiposAvaliacoes && this.unidades[i].unidadesTiposAvaliacoes.length === 1 && (this.unidades[i].unidadesTiposAvaliacoes[c].unidadesTiposAvaliacoesDispositivo && this.unidades[i].unidadesTiposAvaliacoes[c].unidadesTiposAvaliacoesDispositivo.length > 1)))))
                  }

                });
              }

              this.atendente = usuario
            })
          }
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
  public remove(itemAvaliavel: Usuario) {
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
      if (remover) {
        this.usuarioService.remove(itemAvaliavel)
          .then(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.snackBar.open('Excluído com sucesso', 'Fechar', {
              duration: 3000
            })
          })
      }
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

        for (let i = 0; i < this.unidades.length; i++) {
          if (this.unidades[i].id === operador.unidade.id) {
            (this.unidades[i] as any).operador = operador;
          }
        }

      })
  }

  /**
   *
   * @param operador
   */
  public removeOperador(operador): void {
    this.operadorRepository.delete(operador.id)
  }

  /**
   *
   * @param unidadesTiposAvaliacoesDispositivo
   */
  public unidadesTiposAvaliacoesDispositivoChange(unidadesTiposAvaliacoesDispositivo: UnidadeTipoAvaliacaoDispositivo[]): void {
    const toSave = [];

    unidadesTiposAvaliacoesDispositivo.forEach(unidadeTipoAvaliacaoDispositivo => {
      let aux = this.avaliaveis.filter(a => a.unidadeTipoAvaliacaoDispositivo.id === unidadeTipoAvaliacaoDispositivo.id)[0];
      aux = aux ? aux : {};
      (aux.unidadeTipoAvaliacaoDispositivo as any) = {
        id: unidadeTipoAvaliacaoDispositivo.id,
        ativo: unidadeTipoAvaliacaoDispositivo.ativo
      };
      aux.usuario = {id: this.atendente.id};
      aux.ativo = (unidadeTipoAvaliacaoDispositivo as any).unidadeTipoAvaliacaoDispositivoValue;
      delete (aux.unidadeTipoAvaliacaoDispositivo as any).avaliavel;
      toSave.push(aux)
    });

    this.avaliavelRepository.saveAll(toSave).then(result => {

      // Se não tiiver nenhum avaliavel na lista
      if (!result || !result.length) {
        this.avaliaveis = [];
      }// Se tiver avaliaveis
      else {
        for (let k = 0; k < result.length; k++) {
          if (this.avaliaveis.map(a => a.id).filter(id => result[k].id === id).length > 0) {
            for (let i = 0; i < this.avaliaveis.length; i++) {
              if (this.avaliaveis[i].id === result[k].id) {
                this.avaliaveis[i] = result[k];
              }
            }
          } else {
            this.avaliaveis.push(result[k]);
          }
        }
      }
    })
  }

}
