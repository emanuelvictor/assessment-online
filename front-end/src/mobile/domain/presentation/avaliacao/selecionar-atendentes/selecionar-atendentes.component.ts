import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MobileService} from '../../../service/mobile.service';
import {MatSnackBar} from '@angular/material';
import {UsuarioService} from '../../../../../web/domain/service/usuario.service';
import {ColaboradorService} from '../../../../../web/domain/service/colaborador.service';

@Component({
  selector: 'selecionar-atendentes',
  templateUrl: './selecionar-atendentes.component.html',
  styleUrls: ['./selecionar-atendentes.component.scss']
})
export class SelecionarAtendentesComponent implements OnInit {

  /**
   *
   * @type {Array}
   */
  atendentes: any[] = [];

  /**
   *
   */
  timeout: any;

  /**
   *
   * @param {Router} router
   * @param {MobileService} mobileService
   * @param {ColaboradorService} colaboradorService
   * @param {UsuarioService} usuarioService
   * @param {MatSnackBar} snackBar
   */
  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private mobileService: MobileService,
              private usuarioService: UsuarioService,
              private colaboradorService: ColaboradorService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.timeout = setTimeout(() => {
      this.mobileService.reset();
      this.router.navigate(['/avaliar']);
    }, 180000);

    // this.colaboradorService.listColaboradoresByUnidadeKey(this.mobileService.getUnidade()).subscribe(colaboradores => {
    //   this.atendentes = [];
    //   colaboradores.forEach(colaborador => {
    //     this.usuarioService.findOne(colaborador.usuario.key).subscribe(usuario => {
    //       if (colaborador.vinculo && colaborador.vinculo !== 'Operador') {
    //
    //         let founded = false;
    //
    //         for (let i = 0; i < this.atendentes.length; i++)
    //           if (this.atendentes[i].usuario.key === usuario.key) {
    //             this.atendentes[i].usuario = usuario;
    //             founded = true;
    //           }
    //
    //         if (!founded) {
    //           colaborador.usuario = usuario;
    //           this.atendentes.push(colaborador);
    //         }
    //       }
    //     })
    //   });
    // });
  }

  /**
   *
   */
  public concluir() {
    clearTimeout(this.timeout);
    this.atendentes.forEach(colaborador => {
      if (colaborador.selected) {
        this.mobileService.addColaborador(colaborador);
      }
    });

    /**
     * TODO aumentar o timeout da toast
     */
    if (this.mobileService.getColaboradores().length > 0) {
      this.mobileService.enviarAvaliacao();
      this.router.navigate(['conclusao']);
    } else {
      this.snackBar.open('Selecione ao menos um atendente', 'Fechar', this.mobileService.getSnackBarConfig());
    }
  }
}