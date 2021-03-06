import {NgModule} from '@angular/core';
import 'hammerjs';
import {LoginComponent} from '../web/domain/presentation/login/login.component';
import {MAT_DATE_LOCALE, MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatOptionModule, MatPaginatorModule, MatProgressBarModule, MatRadioModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatStepperModule, MatTableModule, MatToolbarModule, MatTooltipModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {CovalentMarkdownModule} from '@covalent/markdown';
import {CovalentChipsModule, CovalentCommonModule, CovalentFileModule, CovalentLoadingModule, CovalentMediaModule} from '@covalent/core';
import {TextMaskModule} from 'angular2-text-mask';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NoSubmitDirective} from '../web/domain/presentation/controls/no-sumbit/no-submit.directive';
import {DocumentoPipe} from '../web/domain/presentation/controls/documento-pipe/documento-pipe';
import {VirgulaPipe} from '../web/domain/presentation/controls/virgula-pipe/peso-pipe';
import {AvatarComponent} from '../web/domain/presentation/controls/avatar/avatar.component';
import {NoWhiteSpace} from '../web/domain/presentation/controls/patterns/no-white-space';
import {LocalStorage} from "../web/infrastructure/local-storage/local-storage";
import {CookieService} from "ngx-cookie-service";
import {TOKEN_NAME} from "../web/domain/presentation/controls/utils";
import {MatKeyboardModule} from "@ngx-material-keyboard/core";
import {ErrorComponent} from "../mobile/domain/presentation/error/error.component";

/**
 *
 */
@NgModule({
  declarations: [
    // Controls
    NoSubmitDirective,
    DocumentoPipe,
    VirgulaPipe,
    NoWhiteSpace,
    AvatarComponent,

    // Authentication
    LoginComponent,

    // Erro
    ErrorComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CovalentLoadingModule,
    MatGridListModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatInputModule,
    CovalentFileModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    HttpClientModule,
    CovalentChipsModule,
    CovalentMediaModule,
    CovalentCommonModule,
    CovalentMarkdownModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    RouterModule,
    MatOptionModule,
    MatSnackBarModule,
    MatStepperModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    TextMaskModule,
    MatKeyboardModule
  ],
  exports: [
    NoWhiteSpace,
    AvatarComponent,

    NoSubmitDirective,
    DocumentoPipe,
    VirgulaPipe,
    LoginComponent,

    // Erro
    ErrorComponent,

    CommonModule,
    ReactiveFormsModule,
    CovalentLoadingModule,
    MatGridListModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatInputModule,
    CovalentFileModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    HttpClientModule,
    CovalentChipsModule,
    CovalentMediaModule,
    CovalentCommonModule,
    CovalentMarkdownModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    RouterModule,
    MatOptionModule,
    MatSnackBarModule,
    MatStepperModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    TextMaskModule
  ],
  providers: [

    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ]
})
export class SharedModule {

  constructor(private tokenStorage: LocalStorage, private cookieService: CookieService) {

    if (this.cookieService.get(TOKEN_NAME)) {
      this.tokenStorage.token = this.cookieService.get(TOKEN_NAME);
    }

    if (this.tokenStorage.token) {
      this.cookieService.set(TOKEN_NAME, this.tokenStorage.token, null, '/');
    }

  }

}
