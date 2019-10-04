import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import 'hammerjs';
import {LoginComponent} from '../domain/presentation/login/login.component';
import {MAT_DATE_LOCALE, MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatOptionModule, MatPaginatorModule, MatProgressBarModule, MatRadioModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatStepperModule, MatTableModule, MatToolbarModule, MatTooltipModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {CovalentMarkdownModule} from '@covalent/markdown';
import {CovalentChipsModule, CovalentCommonModule, CovalentFileModule, CovalentLoadingModule, CovalentMediaModule} from '@covalent/core';
import {TextMaskModule} from 'angular2-text-mask';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NoSubmitDirective} from '../domain/presentation/controls/no-sumbit/no-submit.directive';
import {DocumentoPipe} from '../domain/presentation/controls/documento-pipe/documento-pipe';
import {VirgulaPipe} from '../domain/presentation/controls/virgula-pipe/peso-pipe';
import {AvatarComponent} from '../domain/presentation/controls/avatar/avatar.component';
import {NoWhiteSpace} from '../domain/presentation/controls/patterns/no-white-space';
import {LocalStorage} from "../infrastructure/local-storage/local-storage";
import {CookieService} from "ngx-cookie-service";
import {TOKEN_NAME} from "../domain/presentation/controls/utils";
import {MatKeyboardModule} from "@ngx-material-keyboard/core";
import {CloseButtonComponent} from "../domain/presentation/controls/close-button/close-button.component";
import {AddButtonComponent} from "../domain/presentation/controls/add-button/add-button.component";
import {LoggedMenuComponent} from "../domain/presentation/controls/logged-menu/logged-menu.component";
import {LoggedRootMenuComponent} from "../domain/presentation/controls/logged-root-menu/logged-root-menu.component";
import {ConfirmDialogComponent} from "../domain/presentation/controls/confirm-dialog/confirm-dialog.component";
import {WebComponent} from "../domain/presentation/web.component";
import {HeaderComponent} from "../domain/presentation/controls/header/header.component";
import {FotoLoadingComponent} from "../domain/presentation/controls/foto-loading/foto-loading.component";
import {EvDatepicker} from "../domain/presentation/controls/ev-datepicker/ev-datepicker";
import {SearchBarComponent} from "../domain/presentation/controls/search-bar/search-bar.component";
import {BrandComponent} from "../domain/presentation/controls/brand/brand.component";
import {NoRecordsFoundComponent} from "../domain/presentation/controls/no-records-found/no-records-found.component";

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
    CloseButtonComponent,
    AddButtonComponent,
    LoggedMenuComponent,
    LoggedRootMenuComponent,
    ConfirmDialogComponent,
    WebComponent,
    HeaderComponent,
    FotoLoadingComponent,
    EvDatepicker,
    SearchBarComponent,
    BrandComponent,
    NoRecordsFoundComponent,

    // Authentication
    LoginComponent
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

    // Controls
    CloseButtonComponent,
    AddButtonComponent,
    LoggedMenuComponent,
    LoggedRootMenuComponent,
    ConfirmDialogComponent,
    WebComponent,
    HeaderComponent,
    FotoLoadingComponent,
    EvDatepicker,
    SearchBarComponent,
    BrandComponent,
    NoRecordsFoundComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [

    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ]
})
export class WebSharedModule {

  constructor(private tokenStorage: LocalStorage, private cookieService: CookieService) {

    if (this.cookieService.get(TOKEN_NAME)) {
      this.tokenStorage.token = this.cookieService.get(TOKEN_NAME);
    }

    if (this.tokenStorage.token) {
      this.cookieService.set(TOKEN_NAME, this.tokenStorage.token, null, '/');
    }

  }

}
