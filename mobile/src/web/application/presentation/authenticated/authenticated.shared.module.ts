import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import 'hammerjs';
import {MAT_DATE_LOCALE, MatAutocompleteModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatOptionModule, MatPaginatorModule, MatProgressBarModule, MatRadioModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatStepperModule, MatTableModule, MatToolbarModule, MatTooltipModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {CovalentMarkdownModule} from '@covalent/markdown';
import {CovalentChipsModule, CovalentCommonModule, CovalentFileModule, CovalentLoadingModule, CovalentMediaModule} from '@covalent/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NoSubmitDirective} from '../controls/no-sumbit/no-submit.directive';
import {DocumentoPipe} from '../controls/documento-pipe/documento-pipe';
import {VirgulaPipe} from '../controls/virgula-pipe/peso-pipe';
import {NoWhiteSpace} from '../controls/patterns/no-white-space';
import {LocalStorage} from '../../../infrastructure/local-storage/local-storage';
import {CookieService} from 'ngx-cookie-service';
import {TOKEN_NAME} from '../controls/utils';
import {MatKeyboardModule} from '@ngx-material-keyboard/core';
import {CloseButtonComponent} from '../controls/close-button/close-button.component';
import {AddButtonComponent} from '../controls/add-button/add-button.component';
import {LoggedMenuComponent} from '../controls/logged-menu/logged-menu.component';
import {LoggedRootMenuComponent} from '../controls/logged-root-menu/logged-root-menu.component';
import {ConfirmDialogComponent} from '../controls/confirm-dialog/confirm-dialog.component';
import {HeaderComponent} from '../controls/header/header.component';
import {FotoLoadingComponent} from '../controls/foto-loading/foto-loading.component';
import {EvDatepicker} from '../controls/ev-datepicker/ev-datepicker';
import {SearchBarComponent} from '../controls/search-bar/search-bar.component';
import {NoRecordsFoundComponent} from '../controls/no-records-found/no-records-found.component';
import {WebSharedModule} from '../web.shared.module';
import {OrderModule} from 'ngx-order-pipe';
import {NgxChartsModule} from '@swimlane/ngx-charts';

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
    CloseButtonComponent,
    AddButtonComponent,
    LoggedMenuComponent,
    LoggedRootMenuComponent,
    ConfirmDialogComponent,
    HeaderComponent,
    FotoLoadingComponent,
    EvDatepicker,
    SearchBarComponent,
    NoRecordsFoundComponent
  ],
  imports: [
    WebSharedModule,
    CommonModule,
    CovalentLoadingModule,
    MatGridListModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatExpansionModule,
    CovalentFileModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CovalentChipsModule,
    CovalentMediaModule,
    CovalentCommonModule,
    CovalentMarkdownModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatDialogModule,
    MatToolbarModule,
    MatListModule,
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
    MatKeyboardModule,

    OrderModule,
    NgxChartsModule,
  ],
  exports: [
    NoWhiteSpace,

    NoSubmitDirective,
    DocumentoPipe,
    VirgulaPipe,

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
    CovalentChipsModule,
    CovalentMediaModule,
    CovalentCommonModule,
    CovalentMarkdownModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatDialogModule,
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
    MatKeyboardModule,

    OrderModule,
    NgxChartsModule,

    // Controls
    CloseButtonComponent,
    AddButtonComponent,
    LoggedMenuComponent,
    LoggedRootMenuComponent,
    ConfirmDialogComponent,
    HeaderComponent,
    FotoLoadingComponent,
    EvDatepicker,
    SearchBarComponent,
    NoRecordsFoundComponent,

    WebSharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [

    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ]
})
export class AuthenticatedSharedModule {

  constructor(private tokenStorage: LocalStorage, private cookieService: CookieService) {

    if (this.cookieService.get(TOKEN_NAME)) {
      this.tokenStorage.token = this.cookieService.get(TOKEN_NAME);
    }

    if (this.tokenStorage.token) {
      this.cookieService.set(TOKEN_NAME, this.tokenStorage.token, null, '/');
    }

  }

}
