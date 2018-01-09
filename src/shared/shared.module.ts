import {NgModule} from '@angular/core';
import 'hammerjs';
import {LoginComponent} from "../web/domain/presentation/login/login.component";
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatOptionModule,
  MatPaginatorModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule
} from "@angular/material";
import {RouterModule} from "@angular/router";
import {CovalentMarkdownModule} from "@covalent/markdown";
import {
  CovalentChipsModule,
  CovalentCommonModule,
  CovalentFileModule,
  CovalentLoadingModule,
  CovalentMediaModule
} from "@covalent/core";
import {TextMaskModule} from "angular2-text-mask";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {NoSubmitDirective} from "../web/application/controls/no-sumbit/no-submit.directive";
import {DocumentoPipe} from "../web/application/controls/documento-pipe/documento-pipe";
import {VirgulaPipe} from "../web/application/controls/virgula-pipe/peso-pipe";

/**
 *
 */
@NgModule({
  declarations: [
    // Controls
    NoSubmitDirective,
    DocumentoPipe,
    VirgulaPipe,

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
    TextMaskModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
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
  ],
  exports: [
    //Components
    NoSubmitDirective,
    DocumentoPipe,
    VirgulaPipe,
    LoginComponent,

    //Modules
    CommonModule,
    ReactiveFormsModule,
    CovalentLoadingModule,
    MatGridListModule,
    MatSliderModule,
    MatSlideToggleModule,
    TextMaskModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
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
    MatAutocompleteModule
  ],
})
export class SharedModule {
}
