import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {TdMediaService} from '@covalent/core';
import {Subscription} from 'rxjs/Subscription';
import {UsuarioService} from '../../service/usuario.service';
import {ColaboradorService} from '../../service/colaborador.service';


@Component({
  selector: 'dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss']
})
export class DashboardViewComponent implements OnInit, OnDestroy {

  /**
   *
   * @type {boolean}
   */
  isSmallScreen = true;
  /**
   *
   */
  usuario: any;
  /**
   *
   */
  public querySubscription: Subscription;

  /**
   *
   */
  public routerSubscription: Subscription;

  /**
   *
   * @param {TdMediaService} media
   * @param {NgZone} ngZone
   * @param {UsuarioService} usuarioService
   * @param {ColaboradorService} colaboradorService
   */
  constructor(public media: TdMediaService, public ngZone: NgZone, private usuarioService: UsuarioService, private colaboradorService: ColaboradorService) {
    this.usuarioService.getUsuarioAutenticado().subscribe(result => {
      this.usuario = result;
      this.colaboradorService.listOperadoresByUsuarioKey(this.usuario.key).subscribe(operadores => {
        this.usuario.isOperador = operadores.length > 0;
      });
    });
  }

  /**
   *
   */
  ngOnInit() {
    this.checkScreen();
  }

  /**
   *
   */
  checkScreen(): void {
    this.ngZone.run(() => {
      this.isSmallScreen = this.media.query('gt-md');
    });
    this.watchScreen();
  }

  /**
   * Observa o tamanho da tela para especificar diferentes comportamentos
   */
  watchScreen(): void {
    this.querySubscription = this.media.registerQuery('gt-md').subscribe((matches: boolean) => {
      this.ngZone.run(() => {
        this.isSmallScreen = matches;
      });
    });
  }

  /**
   *
   */
  ngOnDestroy(): void {
    if (this.querySubscription) this.querySubscription.unsubscribe();
    if (this.routerSubscription) this.routerSubscription.unsubscribe();
  }
}
