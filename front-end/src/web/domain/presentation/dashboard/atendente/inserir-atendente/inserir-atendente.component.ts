import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsuarioService} from '../../../../service/usuario.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {Usuario} from '../../../../entity/usuario/usuario.model';
import {Conta} from '../../../../entity/usuario/conta.model';
import {UnidadeService} from "../../../../service/unidade.service";
import {Unidade} from "../../../../entity/unidade/unidade.model";
import {OperadorRepository} from "../../../../repositories/operador.repository";

@Component({
  selector: 'inserir-atendente',
  templateUrl: './inserir-atendente.component.html',
  styleUrls: ['./inserir-atendente.component.css']
})
export class InserirAtendenteComponent implements OnInit, OnDestroy {

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
   * @param {UsuarioService} usuarioService
   * @param {OperadorRepository} operadorRepository
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {ActivatedRoute} activatedRoute
   * @param {UnidadeService} unidadeService
   */
  constructor(private usuarioService: UsuarioService,
              private operadorRepository: OperadorRepository,
              private router: Router, private snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute, private unidadeService: UnidadeService) {
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
    this.unidadeService.listLightByFilters(null)
      .subscribe(result => {
        this.unidades = result.content;
      });
  }

  /**
   *
   */
  public save(): void {
    if (!this.operadores.length && !this.atendente.conta.administrador)
      this.snackBar.open('Selecione ao menos uma unidade', 'Fechar');

    else {
      this.usuarioService.save(this.atendente)
        .then(result => {
          this.atendente = result;

          this.operadores.forEach(operador => {
            operador.usuario = this.atendente;
            this.operadorRepository.save(operador)
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
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
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
   * @param operador
   */
  public saveOperador(operador): void {
    this.operadores.push(operador);
  }

  /**
   *
   * @param unidade
   */
  public saveAvaliavel(unidade): void {
    console.log(unidade)
  }

  /**
   *
   * @param unidade
   */
  public removeAvaliavel(unidade): void {
    console.log(unidade)
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
