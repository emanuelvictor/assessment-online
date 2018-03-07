import {Component, OnInit} from '@angular/core';
import {UsuarioService} from '../../../../service/usuario.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {Usuario} from '../../../../entity/usuario/Usuario.model';
import {Colaborador} from "../../../../entity/colaborador/Colaborador.model";
import {ColaboradorService} from "../../../../service/colaborador.service";

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
   * @param {Title} title
   */
  constructor(public usuarioService: UsuarioService, public router: Router, private colaboradorService: ColaboradorService,
              public snackBar: MatSnackBar, public activatedRoute: ActivatedRoute) {
  }

  /**
   *
   */
  ngOnInit() {
  }

  /**
   *
   */
  public save(): void {

    if (!this.colaboradores.length)
      this.snackBar.open('Selecione ao menos uma unidade', 'Fechar');

    else {
      this.usuarioService.save(this.atendente).then(result => {
        this.colaboradores.forEach(colaborador => {
          this.colaboradorService.save(colaborador)
        });

        this.success('Atendente inserido com sucesso');
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
    this.snackBar.open(message, "Fechar", {
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
      if (this.colaboradores[i].unidade.key === colaborador.unidade.key && !this.colaboradores[i].vinculo) {
        this.colaboradores.splice(i, 1);
        return;
      }

      /**
       * Já tem o mesmo vinculo cancela o restante do algorítimo
       */
      if (this.colaboradores[i].unidade.key === colaborador.unidade.key && this.colaboradores[i].vinculo === colaborador.vinculo) {
        return;
      }

      /**
       * Se o vínculo a ser inserido não é undefined, mas é diferente do contido no array
       */
      if (this.colaboradores[i].unidade.key === colaborador.unidade.key && this.colaboradores[i].vinculo !== undefined && this.colaboradores[i].vinculo !== colaborador.vinculo) {
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
