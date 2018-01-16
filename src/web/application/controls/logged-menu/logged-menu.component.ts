import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {AuthenticationService} from "../../../domain/service/authentication.service";
import {Router} from "@angular/router";
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'logged-menu',
  templateUrl: './logged-menu.component.html',
  styleUrls: ['./logged-menu.component.scss']
})
export class LoggedMenuComponent implements OnDestroy {

  /**
   *
   */
  authenticatedUser: any;

  /**
   *
   */
  userSubscription: Subscription;

  /**
   *
   * @param media
   */
  constructor(public authenticationService: AuthenticationService, public changeDetectionRef: ChangeDetectorRef, public router: Router) {

    // this.authenticatedUser = authenticationService.getPromiseAuthenticatedUser().then(result => this.authenticatedUser = result);

    this.userSubscription = authenticationService.authenticatedUserChanged.subscribe((user) => {
      this.authenticatedUser = user;
      this.changeDetectionRef.detectChanges();
    });
  }

  /**
   *
   */
  ngOnDestroy() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }
}
