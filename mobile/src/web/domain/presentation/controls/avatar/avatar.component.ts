import {Component, Input, OnInit} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import {environment} from '../../../../../environments/environment';


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
   */
  @Input()
  public tenant: string;

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
    if (this.usuario.foto) {
      this.usuario.foto = environment.endpoint + this.usuario.foto + (this.tenant ? ('/' + this.tenant) : '') + '?nocache=' + this.identifier;
    }
    if (!this.size) {
      this.size = 1;
    }
  }
}
