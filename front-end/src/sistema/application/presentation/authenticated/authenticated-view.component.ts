import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {TdMediaService} from '@covalent/core';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../../../domain/service/authentication.service';
import {routerAnimation} from '../controls/utils';
import {environment} from '@src/environments/environment';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'authenticated-view',
  templateUrl: './authenticated-view.component.html',
  styleUrls: ['./authenticated-view.component.scss'],
  animations: [routerAnimation]
})
export class AuthenticatedViewComponent implements OnInit, OnDestroy {

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
   */
  backgroundPath: string = environment.endpoint + 'assets/images/banner-1920x720.svg';

  /**
   *
   * @param _sanitizer
   * @param {TdMediaService} media
   * @param {NgZone} ngZone
   * @param {AuthenticationService} authenticationService
   */
  constructor(private _sanitizer: DomSanitizer,
              public media: TdMediaService, public ngZone: NgZone,
              private authenticationService: AuthenticationService) {

    this.authenticationService.requestContaAutenticada().subscribe(result => {
      this.conta = result;
    })
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
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  /**
   *
   * @param image
   */
  getBackground(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }
}
