import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {Usuario} from '../../../../entity/usuario/usuario.model';
import {ContaService} from '../../../../service/conta.service';
import {TdLoadingService} from '@covalent/core';
import {Conta} from '../../../../entity/usuario/conta.model';
import {AuthenticationService} from '../../../../service/authentication.service';
import {UsuarioRepository} from "../../../../repository/usuario.repository";

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
   * @param usuarioRepository
   * @param {MatSnackBar} snackBar
   * @param {Router} router
   * @param {AuthenticationService} authenticationService
   * @param {ActivatedRoute} activatedRoute
   * @param {TdLoadingService} _loadingService
   */
  constructor(private contaService: ContaService,
              private usuarioRepository: UsuarioRepository,
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

    this.usuarioRepository.getSiteKey()
      .subscribe(result => this.cliente.siteKey = result);
  }

  /**
   *
   */
  public save(): void {
    this._loadingService.register('overlayStarSyntax');

    this.contaService.createAccount(this.cliente)
      .then(result => {
        this.authenticationService.contaAutenticada = result.conta;

        // this.authenticationService.login(this.cliente.conta).then( () => {
          this.router.navigate(['/']);
        // }).catch(() => this._loadingService.resolve('overlayStarSyntax'));

        this._loadingService.resolve('overlayStarSyntax');
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
