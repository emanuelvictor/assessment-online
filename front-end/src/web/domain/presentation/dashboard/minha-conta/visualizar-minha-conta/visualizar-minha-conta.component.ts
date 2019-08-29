import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {AlterarMinhaSenhaComponent} from './alterar-minha-senha/alterar-minha-senha.component';
import {AuthenticationService} from '../../../../service/authentication.service';
import {Usuario} from '../../../../entity/usuario/usuario.model';
import {Subscription} from 'rxjs';
import {UnidadeService} from "../../../../service/unidade.service";
import {OperadorRepository} from "../../../../repository/operador.repository";
import {AvaliavelRepository} from "../../../../repository/avaliavel.repository";
import {viewAnimation} from "../../../controls/utils";
import {ContaService} from "../../../../service/conta.service";
import {ConfiguracaoRepository} from "../../../../repository/configuracao.repository";
import {Router} from "@angular/router";
import {LicencaRepository} from "../../../../repository/licenca.repository";

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
  message: string = null;

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
   * @param licencaRepository
   * @param router
   * @param {MatDialog} dialog
   * @param {MatSnackBar} snackBar
   * @param configuracaoRepository
   * @param contaService
   * @param authenticationService
   * @param unidadeService
   * @param operadorRepository
   * @param avaliavelRepository
   */
  constructor(private router: Router,
              private contaService: ContaService,
              private unidadeService: UnidadeService,
              private operadorRepository: OperadorRepository,
              private avaliavelRepository: AvaliavelRepository,
              private authenticationService: AuthenticationService,
              private licencaRepository: LicencaRepository,
              private configuracaoRepository: ConfiguracaoRepository,
              private dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  /**
   *
   */
  ngOnInit(): void {
    this.message = null;
    this.authenticationService.requestContaAutenticada().subscribe(conta => {
      if (conta.usuario) {
        conta.usuario.conta = conta;
        this.usuario = conta.usuario;

        this.unidadeService.listByUsuarioId({usuarioId: this.usuario.id}).subscribe(result => {
          this.unidades = result;

          this.operadorRepository.listByFilters({usuarioId: this.usuario.id}).subscribe(page => {
            this.operadores = page.content;

            if (this.operadores.length) {
              for (let i = 0; i < this.unidades.length; i++) {
                for (let k = 0; k < this.operadores.length; k++) {
                  if (this.operadores[k].unidade.id === this.unidades[i].id) {
                    this.unidades[i].operadorValue = true;
                    this.unidades[i].operador = this.operadores[k]
                  }
                }
              }
            }
          });

          this.avaliavelRepository.listByFilters({usuarioId: this.usuario.id}).subscribe(page => {
            this.avaliaveis = page.content;
            for (let i = 0; i < this.unidades.length; i++) {
              if (!this.unidades[i].unidadesTiposAvaliacoes) {
                this.unidades[i].unidadesTiposAvaliacoes = []
              }
              for (let k = 0; k < this.avaliaveis.length; k++) {
                if (this.avaliaveis[k].unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao.unidade.id === this.unidades[i].id) {
                  this.unidades[i].avaliavelValue = this.avaliaveis[k].ativo;
                  this.avaliaveis[k].unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao.avaliavel = (this.avaliaveis[k]);
                  this.unidades[i].unidadesTiposAvaliacoes.push(this.avaliaveis[k].unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao)
                }
              }
            }

            this.unidades = this.unidades.filter( u => u.avaliavelValue)
          })

        })
      } else {
        this.message = 'Volte ao acesso administrativo para visualizar seus dados';
      }
    })
  }

  public assumirEsquemaPublico(): void {
    this.contaService.assumirEsquema('public')
      .then(() => {
        this.openSnackBar('Voltando ao acesso administrativo');
        this.ngOnInit();
      })
  }

  /**
   *
   */
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
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
