import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'sistema-closed-positions',
  templateUrl: './closed-positions.component.html',
  styleUrls: ['./closed-positions.component.scss']
})
export class ClosedPositionsComponent implements OnInit {
  items: any[];
  fases: any[];
  constructor() { }

  ngOnInit() {
    this.items = [1,2,3,4];
    this.fases = [];
  }

}
