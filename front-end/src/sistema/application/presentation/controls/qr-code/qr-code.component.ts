import {Component, Input, OnInit} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import {environment} from '@src/environments/environment';
import {HttpClient} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";


@Component({
  selector: 'qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QRCodeComponent implements OnInit {

  /**
   *
   * Identificador da foto "person"
   */
  public identifier: string;

  /**
   *
   */
  @Input()
  public path: any;

  /**
   *
   */
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

    if (this.path) {
      this.path = environment.endpoint + this.path + '?nocache=' + this.identifier;

      this.httpClient.get(this.path, {responseType: 'blob'}).subscribe(result => {

        const urlCreator = window.URL;

          const blob = new Blob([result], {type: 'PNG'});
        this.path = new File([blob], 'qr-code', {type: result.type});
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        // reader.onload = () => this.anexo.caminho = reader.result.toString()

        this.path = (this._sanitizer.bypassSecurityTrustResourceUrl(urlCreator.createObjectURL(this.path)) as any).changingThisBreaksApplicationSecurity;

        console.log(this.path);

        this.done = true;
      })
    }

  }
}
