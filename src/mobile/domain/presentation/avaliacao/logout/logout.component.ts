import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {UsuarioService} from '../../../../../web/domain/service/usuario.service';
import {MobileService} from '../../../service/mobile.service';
import {Router} from "@angular/router";
import {ColaboradorService} from "../../../../../web/domain/service/colaborador.service";
import {AuthenticationService} from "../../../../../web/domain/service/authentication.service";

@Component({
  selector: 'logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  /**
   *
   */
  password: string;

  /**
   *
   */
  operadores = [];

  /**
   *
   */
  timeout: any;

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {UsuarioService} usuarioService
   * @param {MobileService} mobileService
   * @param {ColaboradorService} colaboradorService
   * @param {AuthenticationService} authenticationService
   */
  constructor(private router: Router, private snackBar: MatSnackBar, private usuarioService: UsuarioService, private mobileService: MobileService, private colaboradorService: ColaboradorService, private authenticationService: AuthenticationService) {

    this.timeout = setTimeout(() => {
      this.mobileService.reset();
      this.router.navigate(['/avaliar']);
    }, 180000);

  }

  /**
   *
   */
  ngOnInit(): void {
    this.usuarioService.getAdministradores()
      .subscribe(administradores => {
        this.operadores = this.operadores.concat(administradores);
      });

    if (this.mobileService.getUnidade())
      this.colaboradorService
        .listOperadoresByUnidadeKey(this.mobileService.getUnidade())
        .subscribe(operadores => {
          operadores.forEach(operador => {
            this.usuarioService.findOne(operador.usuario.key)
              .subscribe(usuario => {
                let founded = false;
                this.operadores.forEach(operadorIn => {
                  if (operadorIn.nome === usuario.nome)
                    founded = true;
                });
                if (!founded)
                  this.operadores.push(usuario);
              })
          })
        });
  }

  /**
   *
   */
  public logout(): void {
    if (this.operadores.filter(operador => operador.password === this.password).length > 0) {

      this.mobileService.removeUnidade();
      this.mobileService.reset();

      this.authenticationService.logout()
        .then(() => {
          clearTimeout(this.timeout);
          this.router.navigate(['authentication']);
        });

    } else {
      this.openSnackBar('A senha não coincide');
    }

  }

  /**
   *
   * @param message
   */
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }
}
