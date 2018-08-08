import {ActivatedRoute} from '@angular/router';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Usuario} from '../../../../../entity/usuario/usuario.model';
import {UnidadeService} from '../../../../../service/unidade.service';
import {ColaboradorService} from '../../../../../service/colaborador.service';
import {Colaborador} from '../../../../../entity/colaborador/colaborador.model';
import {UsuarioService} from '../../../../../service/usuario.service';
import {Vinculo} from '../../../../../entity/colaborador/vinculo.enum';
import {AuthenticationService} from '../../../../../service/authentication.service';

@Component({
  selector: 'vincular-unidade',
  templateUrl: './vincular-unidade.component.html',
  styleUrls: ['./vincular-unidade.component.css']
})
export class VincularUnidadeComponent implements OnInit {

  /**
   *
   */
  public unidades: any;

  /**
   *
   * @type {Array}
   */
  public atendentes = [];

  /**
   *
   */
  @Input()
  usuario: Usuario;

  /**
   *
   */
  @Output()
  save: EventEmitter<any> = new EventEmitter();

  /**
   *
   * @param {ActivatedRoute} activatedRoute
   * @param {UnidadeService} unidadeService
   * @param {ColaboradorService} colaboradorService
   * @param {AuthenticationService} authenticationService
   */
  constructor(public activatedRoute: ActivatedRoute,
              public unidadeService: UnidadeService,
              public colaboradorService: ColaboradorService,
              public authenticationService: AuthenticationService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.authenticationService.getContaAutenticada().subscribe(loggedUser => {
      if (loggedUser && loggedUser.isAdministrador) {
        this.unidadeService.find()
          .subscribe(unidades => {

            this.atendentes = [];
            for (let i = 0; i < unidades.length; i++) {
              this.atendentes.push({
                vinculo: 'Nenhum',
                unidade: unidades[i],
                usuario: this.usuario
              });
            }

            this.colaboradorService.listColaboradoresByUsuarioKey(this.usuario.id).subscribe(result => {
              if (result.length) {

                for (let i = 0; i < this.atendentes.length; i++) {
                  for (let k = 0; k < result.length; k++) {
                    if (result[k].unidade.id === this.atendentes[i].unidade.id) {
                      const unidadeTemp = this.atendentes[i].unidade;
                      this.atendentes[i] = result[k];
                      this.atendentes[i].unidade = unidadeTemp;
                    }
                  }
                }

              }
            });
          });
      }

      else {
        if (loggedUser)
          this.unidadeService.find()
            .subscribe(unidades => {
              this.colaboradorService.listOperadoresByUsuarioKey(loggedUser.id).subscribe(colaboradores => {
                const novasUnidades = [];
                colaboradores.forEach(colaborador => {
                  for (let i = 0; i < unidades.length; i++) {
                    if (unidades[i].id === colaborador.unidade.id &&
                      (colaborador.vinculo === Vinculo.Operador || colaborador.vinculo === Vinculo.OperadorAtendente)) {
                      let founded = false;
                      for (let j = 0; j < novasUnidades.length; j++) {
                        if (novasUnidades[j].id === unidades[i].id) {
                          founded = true;
                        }
                      }
                      if (!founded) novasUnidades.push(unidades[i]);
                    }
                  }
                });

                this.atendentes = [];
                for (let i = 0; i < novasUnidades.length; i++) {
                  this.atendentes.push({
                    vinculo: 'Nenhum',
                    unidade: novasUnidades[i],
                    usuario: this.usuario
                  });
                }

                this.colaboradorService.listColaboradoresByUsuarioKey(this.usuario.id).subscribe(result => {
                  if (result.length) {

                    for (let i = 0; i < this.atendentes.length; i++) {
                      for (let k = 0; k < result.length; k++) {
                        if (result[k].unidade.id === this.atendentes[i].unidade.id) {
                          const unidadeTemp = this.atendentes[i].unidade;
                          this.atendentes[i] = result[k];
                          this.atendentes[i].unidade = unidadeTemp;
                        }
                      }
                    }

                  }
                });
              })

            });
      }
    });
  }

  /**
   *
   * @param {Colaborador} colaborador
   */
  public saveColaborador(colaborador: Colaborador = new Colaborador()): void {
    this.save.emit(colaborador);
  }
}
