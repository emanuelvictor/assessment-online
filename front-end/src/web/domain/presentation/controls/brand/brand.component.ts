import {Component, Input, OnInit} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

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
  public configuracao: any =
    {
      logoPath: null
    };

  /**
   *
   * @type {}
   */
  public pathFile: string = './assets/images/baseline-branding_watermark-24px.svg';

  /**
   *
   * @type {boolean}
   */
  @Input()
  public background;

  /**
   *
   */
  public ngOnInit() {
    if (this.background)
      this.pathFile = './assets/images/baseline-landscape-24px.svg';

    this.identifier = Math.floor(Math.random() * 2000).toString();
    this.identifier = this.identifier + this.identifier;
    if (this.configuracao.logoPath)
      this.configuracao.logoPath = this.configuracao.logoPath + '?nocache=' + (this.identifier + this.identifier);
    if (!this.size)
      this.size = 1;
  }

}
