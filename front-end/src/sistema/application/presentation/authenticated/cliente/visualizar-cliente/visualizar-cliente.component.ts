import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {UsuarioService} from '@src/sistema/domain/service/usuario.service';
import {UnidadeService} from '@src/sistema/domain/service/unidade.service';
import {Usuario} from '@src/sistema/domain/entity/usuario/usuario.model';
import {AuthenticationService} from '@src/sistema/domain/service/authentication.service';
import {OperadorRepository} from '@src/sistema/domain/repository/operador.repository';
import {viewAnimation} from '../../../controls/utils';
import {AvaliavelRepository} from '@src/sistema/domain/repository/avaliavel.repository';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'visualizar-cliente',
  templateUrl: './visualizar-cliente.component.html',
  styleUrls: ['./visualizar-cliente.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class VisualizarClienteComponent implements OnInit {

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

      this.unidadeService.listLightByFilters(null).subscribe(result => {
        this.unidades = result.content;

        this.operadorRepository.listByFilters({usuarioId: atendenteId}).subscribe(page => {
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

        this.avaliavelRepository.listByFilters({usuarioId: atendenteId}).subscribe(page => {
          this.avaliaveis = page.content;
          for (let i = 0; i < this.unidades.length; i++) {
            if (!this.unidades[i].unidadesTiposAvaliacoes) {
              this.unidades[i].unidadesTiposAvaliacoes = []
            }
            for (let k = 0; k < this.avaliaveis.length; k++) {
              if (this.avaliaveis[k].unidadeTipoAvaliacao.unidade.id === this.unidades[i].id) {
                this.unidades[i].avaliavelValue = this.avaliaveis[k].ativo;
                this.avaliaveis[k].unidadeTipoAvaliacao.avaliavel = (this.avaliaveis[k]);
                this.unidades[i].unidadesTiposAvaliacoes.push(this.avaliaveis[k].unidadeTipoAvaliacao)
              }
            }
          }
        });

        this.atendente = atendente

      })

    })
  }

}
