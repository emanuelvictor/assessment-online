import {Component, Input, OnInit} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import {environment} from '@src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';


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
  @Input()
  public done = false;

  /**
   *
   * @param httpClient
   * @param _sanitizer
   */
  constructor(private httpClient: HttpClient, private _sanitizer: DomSanitizer) {
  }

  /**
   *
   */
  public ngOnInit() {

    this.identifier = /*this.usuario.id;*/Math.floor(Math.random() * 2000).toString();

    if (this.usuario.foto) {
      this.usuario.foto = environment.endpoint + this.usuario.foto + (this.tenant ? ('/' + this.tenant) : '') + '?nocache=' + this.identifier;

      this.httpClient.get(this.usuario.foto, {responseType: 'blob'}).subscribe(result => {

        const urlCreator = window.URL;

        const blob = new Blob([result], {type: 'PNG'});
        this.usuario.foto = new File([blob], this.usuario.nome, {type: result.type});
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        // reader.onload = () => this.anexo.caminho = reader.result.toString()

        this.usuario.foto = (this._sanitizer.bypassSecurityTrustResourceUrl(urlCreator.createObjectURL(this.usuario.foto)) as any).changingThisBreaksApplicationSecurity;

        this.done = true
      })
    }

    if (!this.size) {
      this.size = 1
    }
  }
}
