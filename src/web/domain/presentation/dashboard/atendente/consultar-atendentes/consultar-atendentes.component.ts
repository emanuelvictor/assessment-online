import {Router} from "@angular/router";
import {MatDialog, MatSnackBar} from "@angular/material";
import {Component, OnInit} from "@angular/core";
import {UsuarioService} from "../../../../service/usuario.service";
import {ColaboradorService} from "../../../../service/colaborador.service";

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
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {MatDialog} dialog
   * @param {UsuarioService} usuarioService
   */
  constructor(public router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public usuarioService: UsuarioService, private colaboradorService: ColaboradorService) {
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


    this.usuarioService.getUsuarioAutenticado().subscribe(usuarioLogado => {
      console.log(usuarioLogado);
      this.usuarioService.find().subscribe(usuarios => {
        console.log('asfdasdf');
        /**
         * Se o usuário é administraodr
         */
        if (usuarioLogado.isAdministrador)
          this.atendentes = usuarios;

        /**
         * Se o usuário não é administrador
         */
        else {
          this.colaboradorService.listOperadoresByUsuarioKey(usuarioLogado.key)
            .subscribe(colaboradores => {
              colaboradores.for(colaborador => {

              });
            })
        }
      })
    })
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
}