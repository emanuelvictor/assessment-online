import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsuarioService} from '../../../../service/usuario.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {Usuario} from '../../../../entity/usuario/usuario.model';
import {Conta} from '../../../../entity/usuario/conta.model';
import {UnidadeService} from '../../../../service/unidade.service';
import {OperadorRepository} from '../../../../repository/operador.repository';
import {AvaliavelRepository} from '../../../../repository/avaliavel.repository';
import {UnidadeTipoAvaliacaoDispositivo} from '../../../../entity/avaliacao/unidade-tipo-avaliacao-dispositivo.model';
import {UnidadeTipoAvaliacaoRepository} from '../../../../repository/unidade-tipo-avaliacao.repository';
import {UnidadeTipoAvaliacaoDispositivoRepository} from '../../../../repository/unidade-tipo-avaliacao-dispositivo.repository';
import {Avaliavel} from '../../../../entity/usuario/vinculo/avaliavel.model';

@Component({
  selector: 'inserir-atendente',
  templateUrl: './inserir-atendente.component.html',
  styleUrls: ['./inserir-atendente.component.css']
})
export class InserirAtendenteComponent implements OnInit, OnDestroy {

  /**
   *
   */
  public avaliaveis: any = [];

  /**
   *
   */
  public operadores: any = [];

  /**
   *
   * @type {Usuario}
   */
  atendente: Usuario = new Usuario();

  /**
   *
   */
  unidades: any;

  /**
   *
   */
  vincularUnidadeTipoAvaliacaoDispositivo: boolean;

  /**
   * @param {UsuarioService} usuarioService
   * @param {OperadorRepository} operadorRepository
   * @param {AvaliavelRepository} avaliavelRepository
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param unidadeTipoAvaliacaoRepository
   * @param unidadeTipoAvaliacaoDispositivoRepository
   * @param {ActivatedRoute} activatedRoute
   * @param {UnidadeService} unidadeService
   */
  constructor(private usuarioService: UsuarioService,
              private operadorRepository: OperadorRepository,
              private avaliavelRepository: AvaliavelRepository,
              private router: Router, private snackBar: MatSnackBar,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository,
              private activatedRoute: ActivatedRoute, private unidadeService: UnidadeService,
              private unidadeTipoAvaliacaoDispositivoRepository: UnidadeTipoAvaliacaoDispositivoRepository) {
  }

  /**
   *
   */
  ngOnInit(): void {
    this.atendente.conta = new Conta();
    this.listUnidadesByFilters();
  }

  /**
   * Consulta de unidades
   *
   */
  public listUnidadesByFilters() {
    this.unidadeService.listLightByFilters({withBondFilter: true}).subscribe(result => {
      this.unidades = result.content;

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

              if (!this.vincularUnidadeTipoAvaliacaoDispositivo) {
                this.vincularUnidadeTipoAvaliacaoDispositivo = this.unidades.length && (this.unidades.length > 1 || (this.unidades.length === 1 && (this.unidades[i].unidadesTiposAvaliacoes && this.unidades[i].unidadesTiposAvaliacoes.length > 1 || (this.unidades[i].unidadesTiposAvaliacoes && this.unidades[i].unidadesTiposAvaliacoes.length === 1 && (this.unidades[i].unidadesTiposAvaliacoes[c].unidadesTiposAvaliacoesDispositivo && this.unidades[i].unidadesTiposAvaliacoes[c].unidadesTiposAvaliacoesDispositivo.length > 1)))))
              }
            })
          }

        })
      }
    })
  }

  /**
   *
   */
  public save(): void {
    if ((!this.avaliaveis.length && !this.operadores.length) && !this.atendente.conta.administrador) {
      this.snackBar.open('Selecione ao menos uma unidade', 'Fechar');
    } else {
      this.usuarioService.save(this.atendente)
        .then(result => {
          this.atendente = result;

          this.operadores.forEach(operador => {
            operador.usuario = this.atendente;
            this.operadorRepository.save(operador)
          });

          this.avaliaveis.forEach(avaliavel => {
            avaliavel.usuario = this.atendente;
            this.avaliavelRepository.save(avaliavel)
          });

          this.success('Item Avaliável inserido com sucesso');
        });
    }
  }

  /**
   *
   * @param message
   */
  public success(message: string) {
    this.openSnackBar(message);
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
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
    this.operadores.push(operador);
  }

  /**
   *
   * @param operador
   */
  public removeOperador(operador): void {
    for (let i = 0; i < this.operadores.length; i++) {
      if (this.operadores[i].unidade.id === operador.unidade.id) {
        this.operadores.splice(i, 1);
        return;
      }
    }
  }

  /**
   *
   * @param avaliavel
   */
  public saveAvaliavel(avaliavel): void {
    this.avaliaveis.push(avaliavel);
  }

  /**
   *
   * @param avaliavel
   */
  public removeAvaliavel(avaliavel): void {
    for (let i = 0; i < this.avaliaveis.length; i++) {
      if (this.avaliaveis[i].unidadeTipoAvaliacaoDispositivo.id === avaliavel.unidadeTipoAvaliacaoDispositivo.id) {
        this.avaliaveis.splice(i, 1);
        return
      }
    }
  }

  /**
   *
   * @param unidadesTiposAvaliacoesDispositivo
   */
  public unidadesTiposAvaliacoesDispositivoChange(unidadesTiposAvaliacoesDispositivo: UnidadeTipoAvaliacaoDispositivo[]): void {
    const toSave = [];

    unidadesTiposAvaliacoesDispositivo.forEach(unidadeTipoAvaliacaoDispositivo => {
      const aux = new Avaliavel();
      (aux.unidadeTipoAvaliacaoDispositivo as any) = {
        id: unidadeTipoAvaliacaoDispositivo.id,
        ativo: unidadeTipoAvaliacaoDispositivo.ativo
      };
      (aux.usuario as any) = {id: this.atendente.id};
      aux.ativo = (unidadeTipoAvaliacaoDispositivo as any).unidadeTipoAvaliacaoDispositivoValue;
      delete (aux.unidadeTipoAvaliacaoDispositivo as any).avaliavel;
      toSave.push(aux)
    });

    toSave.forEach(value => {
      if (value.ativo) {
        this.saveAvaliavel(value);
      } else {
        this.removeAvaliavel(value)
      }
    })

  }

  /**
   *
   */
  ngOnDestroy(): void {
    this.unidades = [];
    this.operadores = [];
    this.atendente = new Usuario();
  }
}
