import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import 'hammerjs';
import {HeaderComponent} from '../application/controls/header/header.component';
import {AuthenticationService} from './service/authentication.service';
import {AuthGuard} from './service/auth-guard.service';
import {DateAdapter,} from '@angular/material';
import {DashboardViewComponent} from "./presentation/dashboard/dashboard-view.component";
import {VisualizarMinhaContaComponent} from "./presentation/dashboard/minha-conta/visualizar-minha-conta/visualizar-minha-conta.component";
import {AlterarMinhaContaComponent} from "./presentation/dashboard/minha-conta/alterar-minha-conta/alterar-minha-conta.component";
import {UsuarioPessoaJuridicaFormComponent} from "./presentation/dashboard/atendente/inserir-atendente/atendente-form/pessoa-juridica/usuario-pessoa-juridica-form.component";
import {UsuarioPessoaFisicaFormComponent} from "./presentation/dashboard/atendente/inserir-atendente/atendente-form/pessoa-fisica/usuario-pessoa-fisica-form.component";
import {PasswordFormComponent} from "./presentation/dashboard/atendente/inserir-atendente/atendente-form/password/password-form.component";
import {MapsComponent} from "../application/controls/maps/maps.component";
import {MinhaContaViewComponent} from "./presentation/dashboard/minha-conta/minha-conta-view.component";
import {SomenteLetras} from "../application/controls/patterns/somente-letras";
import {SomenteAlfanumericos} from "../application/controls/patterns/somente-alfanumericos";
import {SomenteNumeros} from "../application/controls/patterns/somente-numeros";
import {EnderecoService} from "./service/endereco.service";
import {AtendenteService} from "./service/atendente.service";
import {Describer} from "../application/describer/describer";
import {VisualizarAtendenteComponent} from "./presentation/dashboard/atendente/visualizar-atendente/visualizar-atendente.component";
import {DadosFornecedorComponent} from "./presentation/dashboard/atendente/inserir-atendente/atendente-form/fornecedor/dados-fornecedor.component";
import {AlterarMinhaSenhaComponent} from "./presentation/dashboard/minha-conta/visualizar-minha-conta/alterar-minha-senha/alterar-minha-senha.component";
import {AlterarSenhaComponent} from "./presentation/dashboard/atendente/visualizar-atendente/alterar-senha/alterar-senha.component";
import {DadosCooperadorComponent} from "./presentation/dashboard/atendente/inserir-atendente/atendente-form/cooperador/dados-cooperador.component";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {StopPropagationDirective} from "../application/controls/stop-propagation/stop-propagation.directive";
import {RatingComponent} from "../application/controls/rating/rating.component";
import {LongPressDirective} from "../application/controls/long-press/long-press.directive";
import {CurrencyFormatPipe} from "../application/controls/currency-pipe-brl/currency-pipe-brl";
import {GroupByPipe} from "../application/controls/group-by-pipe/group-by";
import {AddButtonComponent} from "../application/controls/add-button/add-button.component";
import {CloseButtonComponent} from "../application/controls/close-button/close-button.component";
import {LoggedMenuComponent} from "../application/controls/logged-menu/logged-menu.component";
import {AvatarComponent} from "../application/controls/avatar/avatar.component";
import {ConfirmDialogComponent} from "../application/controls/confirm-dialog/confirm-dialog.component";
import {CnpjValidator, CpfValidator, DataNascimentoValidator} from "../application/controls/validators/validators";
import {SomenteNumerosPositivos} from "../application/controls/patterns/somente-numeros-positivos";
import {Interceptor} from "../application/interceptor/interceptor";
import {WebRoutingModule} from "./web.routing.module";
import {WebComponent} from "./presentation/web.component";
import {SharedModule} from "../../shared/shared.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {AngularFireModule} from "angularfire2";
import {AngularFirestoreModule} from "angularfire2/firestore";
import {AngularFireAuthModule} from "angularfire2/auth";
import {environment} from "../../environments/environment";
import {AngularFireDatabase} from "angularfire2/database";
import {ConsultarAtendentesComponent} from "./presentation/dashboard/atendente/consultar-atendentes/consultar-atendentes.component";
import {InserirAtendenteComponent} from "./presentation/dashboard/atendente/inserir-atendente/inserir-atendente.component";
import {AlterarAtendenteComponent} from "./presentation/dashboard/atendente/alterar-atendente/alterar-atendente.component";
import {AtendenteViewComponent} from "./presentation/dashboard/atendente/atendente-view.component";
import {UnidadeViewComponent} from "./presentation/dashboard/unidade/unidade-view.component";
import {AlterarUnidadeComponent} from "./presentation/dashboard/unidade/alterar-unidade/alterar-atendente.component";
import {VisualizarUnidadeComponent} from "./presentation/dashboard/unidade/visualizar-unidade/visualizar-unidade.component";
import {InserirUnidadeComponent} from "./presentation/dashboard/unidade/inserir-unidade/inserir-unidade.component";
import {UnidadeFormComponent} from "./presentation/dashboard/unidade/inserir-unidade/unidade-form/unidade-form.component";
import {ConsultarUnidadesComponent} from "./presentation/dashboard/unidade/consultar-unidades/consultar-unidades.component";
import {UnidadeService} from "./service/unidade.service";
import {VisualizarDadosAtendenteComponent} from "./presentation/dashboard/minha-conta/visualizar-minha-conta/visualizar-dados-usuario/visualizar-dados-usuario.component";
import {AtendenteFormComponent} from "./presentation/dashboard/atendente/inserir-atendente/atendente-form/atendente-form.component";

/**
 *
 */
@NgModule({
  declarations: [

    CpfValidator,
    CnpjValidator,
    DataNascimentoValidator,
    CurrencyFormatPipe,

    RatingComponent,
    LongPressDirective,

    StopPropagationDirective,
    GroupByPipe,

    SomenteAlfanumericos,
    SomenteLetras,
    SomenteNumeros,
    SomenteNumerosPositivos,

    // Controls
    CloseButtonComponent,
    AddButtonComponent,
    LoggedMenuComponent,
    AvatarComponent,
    ConfirmDialogComponent,
    WebComponent,
    HeaderComponent,

    // atendente
    AtendenteViewComponent,
    DashboardViewComponent,
    MinhaContaViewComponent,
    VisualizarDadosAtendenteComponent,
    VisualizarMinhaContaComponent,
    AlterarMinhaContaComponent,
    ConsultarAtendentesComponent,
    AtendenteFormComponent,
    UsuarioPessoaJuridicaFormComponent,
    UsuarioPessoaFisicaFormComponent,
    PasswordFormComponent,
    MapsComponent,
    InserirAtendenteComponent,
    AlterarAtendenteComponent,
    VisualizarAtendenteComponent,
    DadosFornecedorComponent,
    DadosCooperadorComponent,

    // Password
    AlterarMinhaSenhaComponent,
    AlterarSenhaComponent,

    // Unidades
    UnidadeViewComponent,
    ConsultarUnidadesComponent,
    AlterarUnidadeComponent,
    VisualizarUnidadeComponent,
    InserirUnidadeComponent,
    UnidadeFormComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    WebRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'assessment-online'), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule // imports firebase/auth, only needed for auth features
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
  entryComponents: [AlterarMinhaSenhaComponent, AlterarSenhaComponent, ConfirmDialogComponent],
  providers: [
    Describer,
    EnderecoService,
    AtendenteService,
    UnidadeService,
    AuthenticationService,
    AngularFireDatabase,

    AuthGuard,
    {provide: LOCALE_ID, useValue: "pt-BR"},

    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    }
  ],
  bootstrap: [WebComponent]
})
export class WebModule {
  constructor(public dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale('pt-BR');
  }
}
