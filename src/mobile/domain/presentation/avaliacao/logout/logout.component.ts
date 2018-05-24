import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {UsuarioService} from '../../../../../web/domain/service/usuario.service';
import {MobileService} from '../../../service/mobile.service';

@Component({
  selector: 'logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnDestroy, OnInit {

  /**
   *
   */
  usuario: any;

  /**
   *
   * @param {MatDialogRef<LogoutComponent>} dialogRef
   * @param {MatSnackBar} snackBar
   * @param {UsuarioService} usuarioService
   */
  constructor(public dialogRef: MatDialogRef<LogoutComponent>, public snackBar: MatSnackBar, public usuarioService: UsuarioService, public mobileService: MobileService) {
  }

  /**
   *
   * @param event
   */
  public logout(event: Event): void {
    event.preventDefault();
  }

  /**
   *
   * @param message
   */
  openSnackBar(message: string) {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }

  /**
   *
   */
  ngOnInit(): void {
    console.log('ngOnInit');
    this.mobileService.setLogoutIsOpening(true)
  }

  /**
   *
   */
  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    this.mobileService.setLogoutIsOpening(false);
  }
}
