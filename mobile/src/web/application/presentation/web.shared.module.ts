import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import 'hammerjs';
import {MAT_DATE_LOCALE, MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDividerModule, MatIconModule, MatInputModule, MatNativeDateModule, MatProgressBarModule, MatSelectModule, MatSnackBarModule, MatTooltipModule} from '@angular/material';
import {AvatarComponent} from './controls/avatar/avatar.component';
import {CommonModule} from '@angular/common';
import {BrandComponent} from './controls/brand/brand.component';
import {CnpjValidator, CpfValidator} from './controls/validators/validators';
import {ErrorComponent} from './controls/error/error.component';
import {PasswordFormComponent} from './authenticated/atendente/inserir-atendente/usuario-form/password/password-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ClienteFormComponent} from './authenticated/cliente/inserir-cliente/cliente-form/cliente-form.component';
import {UsuarioPessoaFisicaFormComponent} from './authenticated/cliente/inserir-cliente/cliente-form/pessoa-fisica/usuario-pessoa-fisica-form.component';
import {UsuarioPessoaJuridicaFormComponent} from './authenticated/cliente/inserir-cliente/cliente-form/pessoa-juridica/usuario-pessoa-juridica-form.component';
import {CovalentFileModule, CovalentLoadingModule} from '@covalent/core';
import {TextMaskModule} from 'angular2-text-mask';
import {InserirClienteComponent} from './authenticated/cliente/inserir-cliente/inserir-cliente.component';
import {WebLoginComponent} from './login/web-login/web-login.component';
import {LoginComponent} from './login/login.component';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {RecaptchaModule} from 'ng-recaptcha';
import {NgxChartsModule} from '@swimlane/ngx-charts';

/**
 *
 */
@NgModule({
  declarations: [
    // Controls
    CpfValidator,
    CnpjValidator,

    ErrorComponent,
    AvatarComponent,
    BrandComponent,
    PasswordFormComponent,

    // Cliente
    ClienteFormComponent,
    InserirClienteComponent,
    UsuarioPessoaFisicaFormComponent,
    UsuarioPessoaJuridicaFormComponent,

    // Authentication
    WebLoginComponent,
    LoginComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,

    MatDatepickerModule,
    MatNativeDateModule,

    CommonModule,
    TextMaskModule,
    RouterModule,

    RecaptchaModule,
    CovalentLoadingModule,
    MatSnackBarModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,

    MatProgressBarModule,
    MatTooltipModule,
    MatDividerModule,
    MatSelectModule,
    MatCheckboxModule,
    NgxChartsModule,
    MatIconModule,
    CovalentFileModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,

    MatDatepickerModule,
    MatNativeDateModule,

    CommonModule,
    TextMaskModule,
    RouterModule,

    RecaptchaModule,
    CovalentLoadingModule,
    MatSnackBarModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,

    MatProgressBarModule,
    MatTooltipModule,
    MatDividerModule,
    MatSelectModule,
    MatCheckboxModule,
    NgxChartsModule,
    CovalentFileModule,

    // Controls
    CpfValidator,
    CnpjValidator,

    ErrorComponent,
    AvatarComponent,
    BrandComponent,
    PasswordFormComponent,

    // Cliente
    ClienteFormComponent,
    InserirClienteComponent,
    UsuarioPessoaFisicaFormComponent,
    UsuarioPessoaJuridicaFormComponent,

    // Authentication
    WebLoginComponent,
    LoginComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [

    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ]
})
export class WebSharedModule {
}
