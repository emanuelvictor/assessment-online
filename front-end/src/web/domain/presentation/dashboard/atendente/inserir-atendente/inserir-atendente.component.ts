import {Component, OnInit} from '@angular/core';
import {UsuarioService} from '../../../../service/usuario.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {Usuario} from '../../../../entity/usuario/usuario.model';
import {Colaborador} from '../../../../entity/colaborador/colaborador.model';
import {ColaboradorService} from '../../../../service/colaborador.service';
import {TdLoadingService} from '@covalent/core';
import {Conta} from '../../../../entity/usuario/conta.model';

@Component({
  selector: 'inserir-atendente',
  templateUrl: './inserir-atendente.component.html',
  styleUrls: ['./inserir-atendente.component.css']
})
export class InserirAtendenteComponent implements OnInit {

  /**
   *
   * @type {Array}
   */
  colaboradores: Colaborador[] = [];

  /**
   *
   * @type {Usuario}
   */
  atendente: Usuario = new Usuario();

  /**
   *
   * @param {UsuarioService} usuarioService
   * @param {Router} router
   * @param {ColaboradorService} colaboradorService
   * @param {MatSnackBar} snackBar
   * @param {ActivatedRoute} activatedRoute
   * @param {TdLoadingService} _loadingService
   */
  constructor(private usuarioService: UsuarioService,
              private colaboradorService: ColaboradorService,
              private router: Router, private snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute, private _loadingService: TdLoadingService) {
  }

  /**
   *
   */
  ngOnInit(): void {
    this.atendente.conta = new Conta();
  }

  /**
   *
   */
  public save(): void {
    if (!this.colaboradores.length && !this.atendente.conta.administrador)
      this.snackBar.open('Selecione ao menos uma unidade', 'Fechar');

    else {
      this._loadingService.register('overlayStarSyntax');

      this.usuarioService.save(this.atendente)
        .then(result => {
          this.atendente = result;
          // TODO passar raciocínio para o back-end
          console.log(this.colaboradores);
          this.colaboradores.forEach(colaborador => {
            colaborador.usuario = this.atendente;
            this.colaboradorService.save(colaborador)
          });

          this._loadingService.resolve('overlayStarSyntax');
          this.success('Atendente inserido com sucesso');
        }).catch(() => this._loadingService.resolve('overlayStarSyntax'));
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
   * @param {Colaborador} colaborador
   */
  public saveColaborador(colaborador: Colaborador = new Colaborador()): void {
    colaborador.usuario = this.atendente;
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
