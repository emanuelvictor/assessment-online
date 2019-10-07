import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import 'hammerjs';
import {MAT_DATE_LOCALE, MatButtonModule, MatCardModule, MatDatepickerModule, MatIconModule, MatInputModule, MatNativeDateModule, MatSnackBarModule} from '@angular/material';
import {AvatarComponent} from "./presentation/controls/avatar/avatar.component";
import {CommonModule} from "@angular/common";
import {BrandComponent} from "./presentation/controls/brand/brand.component";
import {CnpjValidator, CpfValidator} from "./presentation/controls/validators/validators";
import {ErrorComponent} from "./presentation/controls/error/error.component";
import {PasswordFormComponent} from "./presentation/dashboard/atendente/inserir-atendente/usuario-form/password/password-form.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ClienteFormComponent} from "./presentation/dashboard/cliente/inserir-cliente/cliente-form/cliente-form.component";
import {UsuarioPessoaFisicaFormComponent} from "./presentation/dashboard/cliente/inserir-cliente/cliente-form/pessoa-fisica/usuario-pessoa-fisica-form.component";
import {UsuarioPessoaJuridicaFormComponent} from "./presentation/dashboard/cliente/inserir-cliente/cliente-form/pessoa-juridica/usuario-pessoa-juridica-form.component";
import {CovalentLoadingModule} from "@covalent/core";
import {TextMaskModule} from "angular2-text-mask";
import {InserirClienteComponent} from "./presentation/dashboard/cliente/inserir-cliente/inserir-cliente.component";
import {WebLoginComponent} from "./presentation/login/web-login/web-login.component";
import {LoginComponent} from "./presentation/login/login.component";
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {RecaptchaModule} from "ng-recaptcha";

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
