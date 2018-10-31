import {NgModule} from '@angular/core';
import 'hammerjs';
import {MAT_DATE_LOCALE, MatCardModule, MatSnackBarModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";

/**
 *
 */
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    BrowserModule,
    MatCardModule,
    RouterModule,
    FormsModule
  ],
  providers: [

    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ]
})
export class SiteSharedModule {
}
