import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {Usuario} from '../../../entity/usuario/usuario.model';
import {ContaService} from '../../../service/conta.service';
import {TdLoadingService} from '@covalent/core';
import {Conta} from '../../../entity/usuario/conta.model';
import {AuthenticationService} from '../../../service/authentication.service';

@Component({
  selector: 'inserir-cliente',
  templateUrl: './inserir-cliente.component.html',
  styleUrls: ['./inserir-cliente.component.css']
})
export class InserirClienteComponent implements OnInit {


  /**
   *
   * @type {Usuario}
   */
  cliente: Usuario = new Usuario();


  /**
   *
   * @param {ContaService} contaService
   * @param {MatSnackBar} snackBar
   * @param {Router} router
   * @param {AuthenticationService} authenticationService
   * @param {ActivatedRoute} activatedRoute
   * @param {TdLoadingService} _loadingService
   */
  constructor(private contaService: ContaService,
              private authenticationService: AuthenticationService,
              private snackBar: MatSnackBar, private router: Router,
              private activatedRoute: ActivatedRoute, private _loadingService: TdLoadingService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.cliente = new Usuario();
    this.cliente.conta = new Conta();
  }

  /**
   *
   */
  public save(): void {
    this._loadingService.register('overlayStarSyntax');

    this.contaService.createAccount(this.cliente)
      .then(result => {
        this._loadingService.resolve('overlayStarSyntax');
        this.authenticationService.setAuthenticatedUser(result);
        this.router.navigate(['/']);
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

}
