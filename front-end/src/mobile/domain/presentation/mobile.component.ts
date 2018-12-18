/**
 * Created by Emanuel Victor on 17/04/2017.
 */
import {Component} from "@angular/core";

@Component({
  selector: 'mobile-root',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent {

  bcrypt = window['dcodeIO'].bcrypt;

  constructor() {
    const hash = '$2a$10$Ipj9ID5eqEUELkadTfVqm.2Z42AlAARdihUlQegDBaALlaCh8sqeq';

    console.log(this.bcrypt.compareSync("123456", hash));
  }
}