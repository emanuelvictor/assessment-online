import {Component, Input, OnInit} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';


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
  public ngOnInit() {
    this.identifier = /*this.usuario.id;*/Math.floor(Math.random() * 2000).toString();
    if (this.usuario.foto)
      this.usuario.foto = this.usuario.foto + '?nocache=' + this.identifier;
    if (!this.size)
      this.size = 1;
  }
}
