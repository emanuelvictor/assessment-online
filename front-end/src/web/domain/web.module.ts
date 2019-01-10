import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import 'hammerjs';
import {HeaderComponent} from './presentation/controls/header/header.component';
import {AuthenticationService} from './service/authentication.service';
import {DateAdapter, MatExpansionModule} from '@angular/material';
import {DashboardViewComponent} from './presentation/dashboard/dashboard-view.component';
import {VisualizarMinhaContaComponent} from './presentation/dashboard/minha-conta/visualizar-minha-conta/visualizar-minha-conta.component';
import {AlterarMinhaContaComponent} from './presentation/dashboard/minha-conta/alterar-minha-conta/alterar-minha-conta.component';
import {PasswordFormComponent} from './presentation/dashboard/atendente/inserir-atendente/usuario-form/password/password-form.component';
import {MapsComponent} from './presentation/controls/maps/maps.component';
import {MinhaContaViewComponent} from './presentation/dashboard/minha-conta/minha-conta-view.component';
import {SomenteLetras} from './presentation/controls/patterns/somente-letras';
import {SomenteAlfanumericos} from './presentation/controls/patterns/somente-alfanumericos';
import {SomenteNumeros} from './presentation/controls/patterns/somente-numeros';
import {EnderecoService} from './service/endereco.service';
import {UsuarioService} from './service/usuario.service';
import {VisualizarAtendenteComponent} from './presentation/dashboard/atendente/visualizar-atendente/visualizar-atendente.component';
import {AlterarMinhaSenhaComponent} from './presentation/dashboard/minha-conta/visualizar-minha-conta/alterar-minha-senha/alterar-minha-senha.component';
import {AlterarSenhaComponent} from './presentation/dashboard/atendente/visualizar-atendente/alterar-senha/alterar-senha.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {StopPropagationDirective} from './presentation/controls/stop-propagation/stop-propagation.directive';
import {RatingComponent} from './presentation/controls/rating/rating.component';
import {LongPressDirective} from './presentation/controls/long-press/long-press.directive';
import {CurrencyFormatPipe} from './presentation/controls/currency-pipe-brl/currency-pipe-brl';
import {GroupByPipe} from './presentation/controls/group-by-pipe/group-by';
import {OrderByPipe} from './presentation/controls/order-by-pipe/order-by';
import {AddButtonComponent} from './presentation/controls/add-button/add-button.component';
import {CloseButtonComponent} from './presentation/controls/close-button/close-button.component';
import {LoggedMenuComponent} from './presentation/controls/logged-menu/logged-menu.component';
import {ConfirmDialogComponent} from './presentation/controls/confirm-dialog/confirm-dialog.component';
import {CnpjValidator, CpfValidator, DataNascimentoValidator} from './presentation/controls/validators/validators';
import {SomenteNumerosPositivos} from './presentation/controls/patterns/somente-numeros-positivos';
import {Interceptor} from '../application/interceptor/interceptor';
import {WebRoutingModule} from './web-routing.module';
import {WebComponent} from './presentation/web.component';
import {SharedModule} from '../../shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule, registerLocaleData} from '@angular/common';
import {ConsultarAtendentesComponent} from './presentation/dashboard/atendente/consultar-atendentes/consultar-atendentes.component';
import {InserirAtendenteComponent} from './presentation/dashboard/atendente/inserir-atendente/inserir-atendente.component';
import {AlterarAtendenteComponent} from './presentation/dashboard/atendente/alterar-atendente/alterar-atendente.component';
import {AtendenteViewComponent} from './presentation/dashboard/atendente/atendente-view.component';
import {UnidadeViewComponent} from './presentation/dashboard/unidade/unidade-view.component';
import {AlterarUnidadeComponent} from './presentation/dashboard/unidade/alterar-unidade/alterar-unidade.component';
import {VisualizarUnidadeComponent} from './presentation/dashboard/unidade/visualizar-unidade/visualizar-unidade.component';
import {InserirUnidadeComponent} from './presentation/dashboard/unidade/inserir-unidade/inserir-unidade.component';
import {UnidadeFormComponent} from './presentation/dashboard/unidade/inserir-unidade/unidade-form/unidade-form.component';
import {UnidadeService} from './service/unidade.service';
import {AtendenteFormComponent} from './presentation/dashboard/atendente/inserir-atendente/usuario-form/usuario-form.component';
import {UnidadeItemComponent} from './presentation/dashboard/atendente/consultar-atendentes/unidade-item/unidade-item.component';
import {VisualizarDadosUsuarioComponent} from './presentation/dashboard/atendente/visualizar-atendente/visualizar-dados-usuario/visualizar-dados-usuario.component';
import {VincularUnidadeComponent} from './presentation/dashboard/atendente/visualizar-atendente/vincular-unidade/vincular-unidade.component';
import {VisualizarVinculoUnidadeComponent} from './presentation/dashboard/atendente/visualizar-atendente/visualizar-vinculo-unidade/visualizar-vinculo-unidade.component';
import {ColaboradorService} from './service/colaborador.service';
import {FileRepository} from '../infrastructure/repository/file/file.repository';
import {FotoLoadingComponent} from './presentation/controls/foto-loading/foto-loading.component';
import {EstatisticasAtendenteComponent} from './presentation/dashboard/atendente/visualizar-atendente/estatisticas/estatisticas-atendente.component';
import {AvaliacaoService} from './service/avaliacao.service';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {EstatisticasUnidadeComponent} from './presentation/dashboard/unidade/visualizar-unidade/estatisticas/estatisticas-unidade.component';
import localePt from '@angular/common/locales/pt';
import {EvDatepicker} from './presentation/controls/ev-datepicker/ev-datepicker';
import {ListaUnidadesComponent} from './presentation/dashboard/unidade/consultar-unidades/lista-unidades/lista-unidades.component';
import {ConsultarUnidadesComponent} from './presentation/dashboard/unidade/consultar-unidades/consultar-unidades.component';
import {MinhasEstatisticasComponent} from './presentation/dashboard/minha-conta/visualizar-minha-conta/estatisticas/minhas-estatisticas.component';
import {SearchBarComponent} from './presentation/controls/search-bar/search-bar.component';
import {FilterPipe} from './presentation/controls/filter-pipe/filter';
import {AutofocusDirective} from './presentation/controls/autofocus/autofocus';
import {OrderModule} from 'ngx-order-pipe';
import {UsuarioRepository} from './repositories/usuario.repository';
import {UnidadeRepository} from './repositories/unidade.repository';
import {EnderecoRepository} from './repositories/endereco.repository';
import {AvaliacaoRepository} from './repositories/avaliacao.repository';
import {OperadorRepository} from './repositories/operador.repository';
import {AvaliacaoColaboradorRepository} from './repositories/avaliacao-colaborador.repository';
import {ContaRepository} from './repositories/conta.repository';
import {ContaService} from './service/conta.service';
import {InserirClienteComponent} from './presentation/dashboard/cliente/inserir-cliente.component';
import {ClienteFormComponent} from './presentation/dashboard/cliente/cliente-form/cliente-form.component';
import {PageSerialize} from '../infrastructure/page-serialize/page-serialize';
import {WebLoginComponent} from './presentation/login/web-login/web-login.component';
import {ConfiguracaoRepository} from "./repositories/configuracao.repository";
import {ConfiguracaoService} from "./service/configuracao.service";
import {ConfiguracaoComponent} from "./presentation/dashboard/configuracao/configuracao.component";
import {BrandComponent} from './presentation/controls/brand/brand.component';
import {AvaliacaoViewComponent} from "./presentation/dashboard/avaliacao/avaliacao-view.component";
import {ConsultarAvaliacoesComponent} from "./presentation/dashboard/avaliacao/consultar-avaliacoes/consultar-avaliacoes.component";
import {VisualizarAvaliacaoComponent} from "./presentation/dashboard/avaliacao/visualizar-avaliacao/visualizar-avaliacao.component";
import {CroppablePhotoComponent} from "./presentation/controls/croppable-photo/croppable-photo.component";
import {LocalStorage} from "../infrastructure/local-storage/local-storage";
import {CookieService} from "ngx-cookie-service";
import {TipoAvaliacaoViewComponent} from "./presentation/dashboard/tipo-avaliacao/tipo-avaliacao-view.component";
import {InserirTipoAvaliacaoComponent} from "./presentation/dashboard/tipo-avaliacao/inserir-tipo-avaliacao/inserir-tipo-avaliacao.component";
import {TipoAvaliacaoFormComponent} from "./presentation/dashboard/tipo-avaliacao/inserir-tipo-avaliacao/tipo-avaliacao-form/tipo-avaliacao-form.component";
import {ConsultarTiposAvaliacoesComponent} from "./presentation/dashboard/tipo-avaliacao/consultar-tipos-avaliacoes/consultar-tipos-avaliacoes.component";
import {TipoAvaliacaoRepository} from "./repositories/tipo-avaliacao.repository";
import {AlterarTipoAvaliacaoComponent} from "./presentation/dashboard/tipo-avaliacao/alterar-tipo-avaliacao/alterar-tipo-avaliacao.component";
import {VincularTipoAvaliacaoComponent} from "./presentation/dashboard/unidade/visualizar-unidade/vincular-tipo-avaliacao/vincular-tipo-avaliacao.component";
import {UnidadeTipoAvaliacaoRepository} from "./repositories/unidade-tipo-avaliacao.repository";
import {DragDropModule} from "@angular/cdk/drag-drop";

registerLocaleData(localePt, 'pt-BR');

/**
 *
 */
@NgModule({
  declarations: [

    // Controls
    FilterPipe,
    CpfValidator,
    CnpjValidator,
    AutofocusDirective,
    CurrencyFormatPipe,
    DataNascimentoValidator,

    RatingComponent,
    LongPressDirective,

    StopPropagationDirective,
    GroupByPipe,
    OrderByPipe,

    SomenteAlfanumericos,
    SomenteLetras,
    SomenteNumeros,
    SomenteNumerosPositivos,

    CroppablePhotoComponent,

    // Authentication
    WebLoginComponent,

    // Settings
    ConfiguracaoComponent,

    // Controls
    CloseButtonComponent,
    AddButtonComponent,
    LoggedMenuComponent,
    ConfirmDialogComponent,
    WebComponent,
    HeaderComponent,
    FotoLoadingComponent,
    EvDatepicker,
    SearchBarComponent,
    BrandComponent,

    // atendente
    AtendenteViewComponent,
    DashboardViewComponent,
    MinhaContaViewComponent,
    VisualizarDadosUsuarioComponent,
    VisualizarMinhaContaComponent,
    AlterarMinhaContaComponent,
    ConsultarAtendentesComponent,
    AtendenteFormComponent,
    PasswordFormComponent,
    MapsComponent,
    InserirAtendenteComponent,
    AlterarAtendenteComponent,
    VisualizarAtendenteComponent,
    VincularUnidadeComponent,
    VisualizarVinculoUnidadeComponent,
    EstatisticasAtendenteComponent,
    MinhasEstatisticasComponent,
    InserirClienteComponent,

    // Cliente
    InserirClienteComponent,
    ClienteFormComponent,

    // Password
    AlterarMinhaSenhaComponent,
    AlterarSenhaComponent,

    // Unidades
    UnidadeViewComponent,
    ListaUnidadesComponent,
    ConsultarUnidadesComponent,
    AlterarUnidadeComponent,
    VisualizarUnidadeComponent,
    InserirUnidadeComponent,
    UnidadeFormComponent,
    UnidadeItemComponent,
    EstatisticasUnidadeComponent,
    VincularTipoAvaliacaoComponent,

    // Avaliações
    AvaliacaoViewComponent,
    ConsultarAvaliacoesComponent,
    VisualizarAvaliacaoComponent,

    // Tipo avaliações
    TipoAvaliacaoViewComponent,
    AlterarTipoAvaliacaoComponent,
    InserirTipoAvaliacaoComponent,
    TipoAvaliacaoFormComponent,
    ConsultarTiposAvaliacoesComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    BrowserModule,
    OrderModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    WebRoutingModule,
    MatExpansionModule,
    DragDropModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [AlterarMinhaSenhaComponent, AlterarSenhaComponent, ConfirmDialogComponent, FotoLoadingComponent, InserirTipoAvaliacaoComponent],
  providers: [

    PageSerialize,

    UnidadeTipoAvaliacaoRepository,
    AvaliacaoColaboradorRepository,
    TipoAvaliacaoRepository,
    ConfiguracaoRepository,
    OperadorRepository,
    AvaliacaoRepository,
    EnderecoRepository,
    UnidadeRepository,
    UsuarioRepository,
    ContaRepository,
    FileRepository,

    AuthenticationService,
    ConfiguracaoService,
    ColaboradorService,
    AvaliacaoService,
    EnderecoService,
    UsuarioService,
    UnidadeService,
    CookieService,
    LocalStorage,
    ContaService,

    {provide: LOCALE_ID, useValue: 'pt-BR'},

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
    registerLocaleData(localePt);
    dateAdapter.setLocale('pt-BR');
  }
}
