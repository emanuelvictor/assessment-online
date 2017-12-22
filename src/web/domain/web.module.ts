import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import 'hammerjs';
import {HeaderComponent} from '../application/controls/header/header.component';
import {AuthenticationService} from './service/authentication.service';
import {AuthGuard} from './service/auth-guard.service';
import {DateAdapter,} from '@angular/material';
import {DashboardViewComponent} from "./presentation/dashboard/dashboard-view.component";
import {UsuarioViewComponent} from "./presentation/dashboard/usuario/usuario-view.component";
import {VisualizarMinhaContaComponent} from "./presentation/dashboard/minha-conta/visualizar-minha-conta/visualizar-minha-conta.component";
import {VisualizarDadosUsuarioComponent} from "./presentation/dashboard/minha-conta/visualizar-minha-conta/visualizar-dados-usuario/visualizar-dados-usuario.component";
import {AlterarMinhaContaComponent} from "./presentation/dashboard/minha-conta/alterar-minha-conta/alterar-minha-conta.component";
import {UsuarioFormComponent} from "./presentation/dashboard/usuario/inserir-usuario/usuario-form/usuario-form.component";
import {UsuarioPessoaJuridicaFormComponent} from "./presentation/dashboard/usuario/inserir-usuario/usuario-form/pessoa-juridica/usuario-pessoa-juridica-form.component";
import {UsuarioPessoaFisicaFormComponent} from "./presentation/dashboard/usuario/inserir-usuario/usuario-form/pessoa-fisica/usuario-pessoa-fisica-form.component";
import {PasswordFormComponent} from "./presentation/dashboard/usuario/inserir-usuario/usuario-form/password/password-form.component";
import {MapsComponent} from "../application/controls/maps/maps.component";
import {ConsultarUsuariosComponent} from "./presentation/dashboard/usuario/consultar-usuarios/consultar-usuarios.component";
import {InserirUsuarioComponent} from "./presentation/dashboard/usuario/inserir-usuario/inserir-usuario.component";
import {MinhaContaViewComponent} from "./presentation/dashboard/minha-conta/minha-conta-view.component";
import {AlterarUsuarioComponent} from "./presentation/dashboard/usuario/alterar-usuario/alterar-usuario.component";
import {SomenteLetras} from "../application/controls/patterns/somente-letras";
import {SomenteAlfanumericos} from "../application/controls/patterns/somente-alfanumericos";
import {SomenteNumeros} from "../application/controls/patterns/somente-numeros";
import {EnderecoService} from "./service/endereco.service";
import {UsuarioService} from "./service/usuario.service";
import {Describer} from "../application/describer/describer";
import {VisualizarUsuarioComponent} from "./presentation/dashboard/usuario/visualizar-usuario/visualizar-usuario.component";
import {DadosFornecedorComponent} from "./presentation/dashboard/usuario/inserir-usuario/usuario-form/fornecedor/dados-fornecedor.component";
import {PontoColetaService} from "./service/ponto-coleta.service";
import {ConsultarPontosColetaComponent} from "./presentation/dashboard/ponto-coleta/consultar-pontos-coleta/consultar-pontos-coleta.component";
import {PontoColetaFormComponent} from "./presentation/dashboard/ponto-coleta/inserir-ponto-coleta/ponto-coleta-form/ponto-coleta-form.component";
import {InserirPontoColetaComponent} from "./presentation/dashboard/ponto-coleta/inserir-ponto-coleta/inserir-ponto-coleta.component";
import {PontoColetaViewComponent} from "./presentation/dashboard/ponto-coleta/ponto-coleta-view.component";
import {AlterarPontoColetaComponent} from "./presentation/dashboard/ponto-coleta/alterar-ponto-coleta/alterar-ponto-coleta.component";
import {AlterarMinhaSenhaComponent} from "./presentation/dashboard/minha-conta/visualizar-minha-conta/alterar-minha-senha/alterar-minha-senha.component";
import {AlterarSenhaComponent} from "./presentation/dashboard/usuario/visualizar-usuario/alterar-senha/alterar-senha.component";
import {VisualizarPontoColetaComponent} from "./presentation/dashboard/ponto-coleta/visualizar-ponto-coleta/visualizar-ponto-coleta.component";
import {DadosCooperadorComponent} from "./presentation/dashboard/usuario/inserir-usuario/usuario-form/cooperador/dados-cooperador.component";
import {ConsultarFornecedoresComponent} from "./presentation/dashboard/fornecedor/consultar-fornecedores/consultar-fornecedores.component";
import {FornecedorViewComponent} from "./presentation/dashboard/fornecedor/fornecedor-view.component";
import {InserirFornecedorComponent} from "./presentation/dashboard/fornecedor/inserir-fornecedor/inserir-fornecedor.component";
import {AlterarFornecedorComponent} from "./presentation/dashboard/fornecedor/alterar-fornecedor/alterar-fornecedor.component";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {StopPropagationDirective} from "../application/controls/stop-propagation/stop-propagation.directive";
import {RatingComponent} from "../application/controls/rating/rating.component";
import {LongPressDirective} from "../application/controls/long-press/long-press.directive";
import {CurrencyFormatPipe} from "../application/controls/currency-pipe-brl/currency-pipe-brl";
import {GroupByPipe} from "../application/controls/group-by-pipe/group-by";
import {EntradaService} from "./service/entrada.service";
import {FichaViewComponent} from "./presentation/dashboard/ficha/ficha-view.component";
import {VisualizarFichaComponent} from "./presentation/dashboard/ficha/visualizar-ficha/visualizar-ficha.component";
import {ConsultarFichasComponent} from "./presentation/dashboard/ficha/consultar-fichas/consultar-fichas.component";
import {InserirFichaComponent} from "./presentation/dashboard/ficha/inserir-ficha/inserir-ficha.component";
import {FichaService} from "./service/ficha.service";
import {FichaFormComponent} from "./presentation/dashboard/ficha/inserir-ficha/ficha-form/ficha-form.component";
import {AddButtonComponent} from "../application/controls/add-button/add-button.component";
import {CloseButtonComponent} from "../application/controls/close-button/close-button.component";
import {LoggedMenuComponent} from "../application/controls/logged-menu/logged-menu.component";
import {AvatarComponent} from "../application/controls/avatar/avatar.component";
import {ConfirmDialogComponent} from "../application/controls/confirm-dialog/confirm-dialog.component";
import {CnpjValidator, CpfValidator, DataNascimentoValidator} from "../application/controls/validators/validators";
import {EntradaViewComponent} from "./presentation/dashboard/entrada/entrada-view.component";
import {InserirEntradaComponent} from "./presentation/dashboard/entrada/inserir-entrada/inserir-entrada.component";
import {VisualizarEntradaComponent} from "./presentation/dashboard/entrada/visualizar-entrada/visualizar-entrada.component";
import {EntradaFormComponent} from "./presentation/dashboard/entrada/inserir-entrada/entrada-form/entrada-form.component";
import {ConsultarEntradasComponent} from "./presentation/dashboard/entrada/consultar-entradas/consultar-entradas.component";
import {VisualizarDadosEntradaComponent} from "./presentation/dashboard/entrada/visualizar-entrada/visualizar-dados-entrada/visualizar-dados-entrada.component";
import {SomenteNumerosPositivos} from "../application/controls/patterns/somente-numeros-positivos";
import {AlterarEntradaComponent} from "./presentation/dashboard/entrada/alterar-entrada/alterar-entrada.component";
import {Interceptor} from "../application/interceptor/interceptor";
import {AlterarFichaComponent} from "./presentation/dashboard/ficha/alterar-ficha/alterar-ficha.component";
import {WebRoutingModule} from "./web.routing.module";
import {WebComponent} from "./presentation/web.component";
import {SharedModule} from "../../shared/shared.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";

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

    // Usuario
    UsuarioViewComponent,
    DashboardViewComponent,
    MinhaContaViewComponent,
    VisualizarDadosUsuarioComponent,
    VisualizarMinhaContaComponent,
    AlterarMinhaContaComponent,
    ConsultarUsuariosComponent,
    UsuarioFormComponent,
    UsuarioPessoaJuridicaFormComponent,
    UsuarioPessoaFisicaFormComponent,
    PasswordFormComponent,
    MapsComponent,
    InserirUsuarioComponent,
    AlterarUsuarioComponent,
    VisualizarUsuarioComponent,
    DadosFornecedorComponent,
    DadosCooperadorComponent,

    // Fornecedor
    ConsultarFornecedoresComponent,
    FornecedorViewComponent,
    InserirFornecedorComponent,
    AlterarFornecedorComponent,

    // Password
    AlterarMinhaSenhaComponent,
    AlterarSenhaComponent,

    // Pontos de coleta
    PontoColetaViewComponent,
    ConsultarPontosColetaComponent,
    AlterarPontoColetaComponent,
    VisualizarPontoColetaComponent,
    InserirPontoColetaComponent,
    PontoColetaFormComponent,

    //Entradas
    EntradaViewComponent,
    ConsultarEntradasComponent,
    InserirEntradaComponent,
    AlterarEntradaComponent,
    VisualizarEntradaComponent,
    VisualizarDadosEntradaComponent,
    EntradaFormComponent,
    AlterarFichaComponent,

    //Fichas
    FichaViewComponent,
    ConsultarFichasComponent,
    InserirFichaComponent,
    VisualizarFichaComponent,
    FichaFormComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    WebRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
  entryComponents: [AlterarMinhaSenhaComponent, AlterarSenhaComponent, ConfirmDialogComponent],
  providers: [
    Describer,
    FichaService,
    EntradaService,
    UsuarioService,
    EnderecoService,
    PontoColetaService,
    AuthenticationService,

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
