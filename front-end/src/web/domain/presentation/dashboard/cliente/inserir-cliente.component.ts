import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {TdLoadingService} from '@covalent/core';
import {UsuarioService} from '../../../service/usuario.service';
import {Usuario} from '../../../entity/usuario/usuario.model';
import {ColaboradorService} from '../../../service/colaborador.service';
import {Colaborador} from '../../../entity/colaborador/colaborador.model';

@Component({
  selector: 'inserir-cliente',
  templateUrl: './inserir-cliente.component.html',
  styleUrls: ['./inserir-cliente.component.css']
})
export class InserirClienteComponent implements OnInit {

  /**
   *
   * @type {Array}
   */
  colaboradores: Colaborador[] = [];

  /**
   *
   * @type {Usuario}
   */
  cliente: Usuario = new Usuario();

  /**
   *
   * @param {UsuarioService} usuarioService
   * @param {Router} router
   * @param {ColaboradorService} colaboradorService
   * @param {MatSnackBar} snackBar
   * @param {ActivatedRoute} activatedRoute
   * @param {TdLoadingService} _loadingService
   */
  constructor(private usuarioService: UsuarioService, private router: Router,
              private colaboradorService: ColaboradorService, private snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute, private _loadingService: TdLoadingService) {
  }

  /**
   *
   */
  ngOnInit(): void {
  }

  /**
   *
   */
  public save(): void {
    this._loadingService.register('overlayStarSyntax');

    this.usuarioService.save(this.cliente)
      .then(result => {
        this.cliente = result;
        this.colaboradores.forEach(colaborador => {
          colaborador.usuario = this.cliente;
          this.colaboradorService.save(colaborador)
        });

        this._loadingService.resolve('overlayStarSyntax');
        this.success('Cadastro com sucesso');
      }).catch(() => this._loadingService.resolve('overlayStarSyntax'));
  }

  /**
   *
   * @param {string} message
   */
  public success(message: string) {
    this.openSnackBar(message);
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }

  /**
   *
   * @param {string} message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }

  /**
   *
   * @param {Colaborador} colaborador
   */
  public saveColaborador(colaborador: Colaborador = new Colaborador()): void {
    colaborador.usuario = this.cliente;
    for (let i = 0; i < this.colaboradores.length; i++) {

      /**
       * Se o vínculo a ser inserido é undefined, remove o mesmo do array a ser inserido
       */
      if (this.colaboradores[i].unidade.id === colaborador.unidade.id && !this.colaboradores[i].vinculo) {
        this.colaboradores.splice(i, 1);
        return;
      }

      /**
       * Já tem o mesmo vinculo cancela o restante do algorítimo
       */
      if (this.colaboradores[i].unidade.id === colaborador.unidade.id && this.colaboradores[i].vinculo === colaborador.vinculo) {
        return;
      }

      /**
       * Se o vínculo a ser inserido não é undefined, mas é diferente do contido no array
       */
      if (this.colaboradores[i].unidade.id === colaborador.unidade.id && this.colaboradores[i].vinculo !== undefined && this.colaboradores[i].vinculo !== colaborador.vinculo) {
        this.colaboradores[i] = colaborador;
        return;
      }
    }

    /**
     * Se a chave da unidade não foi encontrada no array, insere o novo colaborador
     */
    if (colaborador.vinculo)
      this.colaboradores.push(colaborador);
  }
}
