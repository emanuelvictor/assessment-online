// ANGULAR
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TextMaskModule} from 'angular2-text-mask';
import {CurrencyMaskModule} from 'ng2-currency-mask';
// https://github.com/lentschi/ngx-ellipsis
import {EllipsisModule} from 'ngx-ellipsis';
// ANGULAR MATERIAL
// COVALENT
import {CovalentChipsModule, CovalentCommonModule, CovalentDialogsModule, CovalentExpansionPanelModule, CovalentFileModule, CovalentLoadingModule, CovalentMediaModule} from '@covalent/core';
import {CovalentMarkdownModule} from '@covalent/markdown';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatDialogModule} from "@angular/material/dialog";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatTabsModule} from "@angular/material/tabs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTableModule} from "@angular/material/table";
import {MatStepperModule} from "@angular/material/stepper";
import {MatSortModule} from "@angular/material/sort";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSliderModule} from "@angular/material/slider";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatRadioModule} from "@angular/material/radio";
import {MatSidenavModule} from "@angular/material/sidenav";

/**
 *
 */
@NgModule({
  declarations: [
  ],
  imports: [
    // ANGULAR
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    RouterModule,
    TextMaskModule,
    CurrencyMaskModule,

    // ANGULAR MATERIAL
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
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
    MatTooltipModule,
    MatFormFieldModule,
    MatTabsModule,

    // COVALENT
    CovalentChipsModule,
    CovalentCommonModule,
    CovalentFileModule,
    CovalentLoadingModule,
    CovalentMediaModule,
    CovalentDialogsModule,
    CovalentMarkdownModule,
    CovalentExpansionPanelModule,

    // Ellipsis
    EllipsisModule
  ],
  exports: [
    // ANGULAR
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TextMaskModule,
    CurrencyMaskModule,
    DragDropModule,

    // ANGULAR MATERIAL
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
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
    MatTooltipModule,
    MatFormFieldModule,
    MatTabsModule,

    // COVALENT
    CovalentChipsModule,
    CovalentCommonModule,
    CovalentFileModule,
    CovalentLoadingModule,
    CovalentMediaModule,
    CovalentDialogsModule,
    CovalentMarkdownModule,
    CovalentExpansionPanelModule,

    // Ellipsis
    EllipsisModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}
  ]
})
export class SharedModule {
  constructor(public dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale('pt-BR');
  }
}
