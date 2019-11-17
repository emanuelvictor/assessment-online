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

    this.path = environment.endpoint + this.path + '?nocache=' + this.identifier;

  }
}
