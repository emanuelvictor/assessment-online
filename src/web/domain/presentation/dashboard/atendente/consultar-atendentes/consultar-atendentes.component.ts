import {Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Component, OnInit} from '@angular/core';
import {UsuarioService} from '../../../../service/usuario.service';
import {ColaboradorService} from '../../../../service/colaborador.service';

@Component({
  selector: 'consultar-atendentes',
  templateUrl: './consultar-atendentes.component.html',
  styleUrls: ['./consultar-atendentes.component.css']
})
export class ConsultarAtendentesComponent implements OnInit {

  /**
   *
   */
  public atendentes: any[];

  /**
   *
   */
  public loggedUser: any;

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MatDialog} dialog
   * @param {UsuarioService} usuarioService
   */
  constructor(private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog, private usuarioService: UsuarioService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.listUsuariosByFilters();
  }

  /**
   *
   */
  public listUsuariosByFilters() {
    this.atendentes = [];
    this.usuarioService.getUsuarioAutenticado().subscribe(result => {

      if (result.isAdministrador) {

        this.usuarioService.find().subscribe(atendentes => {
          this.atendentes = atendentes;
        })

      } else {

        this.usuarioService.listAtendentesByCooperadorKey(result.key)
          .subscribe(atendentes => {
            // console.log(atendentes);
            this.atendentes = atendentes;
          })

      }

    })


    //     /**
    //      * Se o usuário é administraodr
    //      */
    //     if (this.loggedUser.isAdministrador)
    //       this.atendentes = usuarios;
    //
    //     /**
    //      * Se o usuário não é administrador
    //      */
    //     else {
    //       this.colaboradorService.listOperadoresByUsuarioKey(this.loggedUser.key).subscribe(operadores => {
    //         for (let c = 0; c < operadores.length; c++) {
    //           this.atendentes = [];
    //           this.colaboradorService.listAtendentesByUnidadeKey(operadores[c].unidade.key).subscribe(atendentes => {
    //             for (let k = 0; k < atendentes.length; k++) {
    //               let founded = false;
    //               for (let i = 0; i < this.atendentes.length; i++) {
    //                 founded = this.atendentes[i].key === atendentes[k].usuario.key;
    //               }
    //               if (!founded) {
    //                 this.usuarioService.findOne(atendentes[k].usuario.key)
    //                   .subscribe(result => {
    //                     this.atendentes.push(result);
    //                   })
    //               }
    //             }
    //           })
    //         }
    //       });
    //     }
    //   })
    // });
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
}