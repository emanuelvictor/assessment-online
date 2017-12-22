import {Component, OnInit} from "@angular/core";
import 'rxjs/add/operator/toPromise';
import {Router} from "@angular/router";


/**
 *
 */
@Component({
  selector: 'entrada-inserida',
  templateUrl: './entrada-inserida.component.html',
  styleUrls: ['./entrada-inserida.component.scss']
})
export class EntradaInseridaComponent  implements OnInit {
  /**
   *
   */
  constructor(private router: Router) {
  }

  /**
   *
   */
  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['../']);
    }, 5000);
  }

}