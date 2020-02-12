import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import 'hammerjs';
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
import {SistemaSharedModule} from '../sistema.shared.module';
import {OrderModule} from 'ngx-order-pipe';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {CovalentHighlightModule} from '@covalent/highlight';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSliderModule} from "@angular/material/slider";
import {MatRadioModule} from "@angular/material/radio";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatDialogModule} from "@angular/material/dialog";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatStepperModule} from "@angular/material/stepper";
import {MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatInputModule} from "@angular/material/input";

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
    SistemaSharedModule,
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
    CovalentHighlightModule,
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

    SistemaSharedModule
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
