import {Component, Input, OnInit} from '@angular/core';
import "rxjs/add/operator/switchMap";

@Component({
  selector: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  /**
   *
   */
  @Input()
  public size: number = 0.8;

  /**
   *
   * Identificador da foto "person"
   */
  public identifier: string;

  /**
   *
   */
  @Input()
  public usuario: any =
    {
      foto: null
    };

  /**
   *
   */
  constructor() {
  }

  /**
   *
   */
  public ngOnInit() {
    this.identifier = Math.floor(Math.random() * 2000).toString();
    if (!this.size)
      this.size = 1;
  }
}
