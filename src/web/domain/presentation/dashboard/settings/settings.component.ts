import {Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry} from "@angular/material";

/**
 *
 */
@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {


  /**
   *
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   */
  constructor(private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.iconRegistry.addSvgIconInNamespace('mobile-assets', 'terrivel', this.domSanitizer.bypassSecurityTrustResourceUrl('web-assets/emojis/terrivel.svg'));
    this.iconRegistry.addSvgIconInNamespace('mobile-assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('web-assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('mobile-assets', 'meia-boca', this.domSanitizer.bypassSecurityTrustResourceUrl('web-assets/emojis/meia-boca.svg'));
    this.iconRegistry.addSvgIconInNamespace('mobile-assets', 'bacana', this.domSanitizer.bypassSecurityTrustResourceUrl('web-assets/emojis/bacana.svg'));
    this.iconRegistry.addSvgIconInNamespace('mobile-assets', 'top-da-balada', this.domSanitizer.bypassSecurityTrustResourceUrl('web-assets/emojis/top-da-balada.svg'));
  }

  /**
   *
   */
  ngOnInit(): void {
  }
}
