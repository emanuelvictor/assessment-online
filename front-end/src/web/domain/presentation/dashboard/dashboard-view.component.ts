import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {TdMediaService} from '@covalent/core';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../../service/authentication.service';
import {routerAnimation} from "../controls/utils";


@Component({
  selector: 'dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
  animations: [routerAnimation]
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
  conta: any;

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
   * @param {AuthenticationService} authenticationService
   */
  constructor(public media: TdMediaService, public ngZone: NgZone,
              private authenticationService: AuthenticationService) {

    this.authenticationService.requestContaAutenticada().subscribe(result => {
      this.conta = result;
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
