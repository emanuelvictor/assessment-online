import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../../../web/domain/service/authentication.service";

@Component({
  selector: 'offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.css']
})
export class OfflineComponent {
  /**
   *
   * @param {AuthenticationService} authenticationService
   * @param {Router} router
   */
  constructor(private router: Router,
              private authenticationService: AuthenticationService) {

  }

  clickHandler() {
    this.authenticationService.onlineCheck();
  }


}
