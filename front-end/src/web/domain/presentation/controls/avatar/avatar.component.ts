import {Component, Input, OnInit} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';


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
  public brand: boolean = false;

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
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   */
  constructor(private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
  }

  /**
   *
   */
  public ngOnInit() {

    this.iconRegistry.addSvgIconInNamespace('assets', 'brand', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/baseline-cloud_upload-24px.svg'));

    this.identifier = /*this.usuario.id;*/Math.floor(Math.random() * 2000).toString();
    if (this.usuario.foto)
      this.usuario.foto = this.usuario.foto + '?nocache=' + this.identifier;
    if (!this.size)
      this.size = 1;
  }
}
