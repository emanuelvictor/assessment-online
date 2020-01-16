import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sistema-open-positions',
  templateUrl: './open-positions.component.html',
  styleUrls: ['./open-positions.component.scss']
})
export class OpenPositionsComponent implements OnInit {
  items: any[];

  constructor() { }

  ngOnInit() {
    this.items = [1,2,3,4,5,6];
  }

}
