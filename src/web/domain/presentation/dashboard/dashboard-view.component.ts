import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {TdMediaService} from '@covalent/core';
import {Subscription} from 'rxjs/Subscription';


@Component({
  selector: 'dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss']
})
export class DashboardViewComponent implements OnInit, OnDestroy
{

  /**
   *
   * @type {boolean}
   */
  isSmallScreen: boolean = true;

  /**
   *
   */
  public querySubscription: Subscription;

  /**
   *
   */
  public routerSubscription: Subscription;

  /*-------------------------------------------------------------------
   *                           CONSTRUCTOR
   *-------------------------------------------------------------------*/
  /**
   *
   * @param {TdMediaService} media
   * @param {NgZone} ngZone
   */
  constructor(public media: TdMediaService,  public ngZone: NgZone)
  {
  }

  /**
   *
   */
  ngOnInit()
  {
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
    if(this.querySubscription) this.querySubscription.unsubscribe();
    if(this.routerSubscription) this.routerSubscription.unsubscribe();
  }
}
