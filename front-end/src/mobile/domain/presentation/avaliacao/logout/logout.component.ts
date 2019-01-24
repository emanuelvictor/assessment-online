import {Component} from '@angular/core';
import {MobileService} from '../../../service/mobile.service';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../../../web/domain/service/authentication.service";

@Component({
  selector: 'logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {

  /**
   *
   */
  password: string;

  /**
   *
   */
  timeout: any;

  /**
   *
   * @param {MobileService} mobileService
   * @param {AuthenticationService} authenticationService
   * @param {Router} router
   */
  constructor(private router: Router,
              private mobileService: MobileService,
              private authenticationService: AuthenticationService) {

    this.timeout = setTimeout(() => {
      this.mobileService.reset();
      this.router.navigate(['/avaliar/1']);
    }, 180000);

  }

  /**
   *
   */
  public logout(): void {
    this.authenticationService.authenticateByUnidade(this.mobileService.getUnidadeId(), this.password)
      .then(() => {

        this.mobileService.removeUnidade();
        this.mobileService.reset();

        this.authenticationService.logout()
          .then(() => {
            clearTimeout(this.timeout);
            this.router.navigate(['authentication']);
          });

      })
  }

}
