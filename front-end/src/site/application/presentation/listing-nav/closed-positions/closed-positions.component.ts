import {Component} from '@angular/core';

@Component({
  selector: 'sistema-closed-positions',
  templateUrl: './closed-positions.component.html',
  styleUrls: ['./closed-positions.component.scss']
})
export class ClosedPositionsComponent {
  /**
   *
   * @param url
   */
  goTo(url: string) {
    window.open(
      url,
      '_blank' // <- This is what makes it open in a new window.
    );
  }
}
