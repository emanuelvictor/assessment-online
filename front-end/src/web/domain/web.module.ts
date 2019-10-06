import {LOCALE_ID, NgModule} from '@angular/core';
import 'hammerjs';
import {AuthenticationService} from './service/authentication.service';
import {DateAdapter, MatStepperModule} from '@angular/material';
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
import {ConfirmDialogComponent} from './presentation/controls/confirm-dialog/confirm-dialog.component';
import {CnpjValidator, CpfValidator, DataNascimentoValidator} from './presentation/controls/validators/validators';
import {SomenteNumerosPositivos} from './presentation/controls/patterns/somente-numeros-positivos';
import {Interceptor} from '../application/interceptor/interceptor';
import {WebRoutingModule} from './web.routing.module';
import {WebComponent} from './presentation/web.component';
import {WebSharedModule} from '../application/web.shared.module';
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
import {FileRepository} from '../infrastructure/repository/file/file.repository';
import {FotoLoadingComponent} from './presentation/controls/foto-loading/foto-loading.component';
import {EstatisticasAtendenteComponent} from './presentation/dashboard/atendente/visualizar-atendente/estatisticas/estatisticas-atendente.component';
import {AvaliacaoService} from './service/avaliacao.service';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {EstatisticasUnidadeComponent} from './presentation/dashboard/unidade/visualizar-unidade/estatisticas/estatisticas-unidade.component';
import localePt from '@angular/common/locales/pt';
import {ListaUnidadesComponent} from './presentation/dashboard/unidade/consultar-unidades/lista-unidades/lista-unidades.component';
import {ConsultarUnidadesComponent} from './presentation/dashboard/unidade/consultar-unidades/consultar-unidades.component';
import {MinhasEstatisticasComponent} from './presentation/dashboard/minha-conta/visualizar-minha-conta/estatisticas/minhas-estatisticas.component';
import {FilterPipe} from './presentation/controls/filter-pipe/filter';
import {AutofocusDirective} from './presentation/controls/autofocus/autofocus';
import {UsuarioRepository} from './repository/usuario.repository';
import {UnidadeRepository} from './repository/unidade.repository';
import {EnderecoRepository} from './repository/endereco.repository';
import {AvaliacaoRepository} from './repository/avaliacao.repository';
import {OperadorRepository} from './repository/operador.repository';
import {AvaliacaoAvaliavelRepository} from './repository/avaliacao-avaliavel-repository.service';
import {ContaRepository} from './repository/conta.repository';
import {ContaService} from './service/conta.service';
import {InserirClienteComponent} from './presentation/dashboard/cliente/inserir-cliente/inserir-cliente.component';
import {ClienteFormComponent} from './presentation/dashboard/cliente/inserir-cliente/cliente-form/cliente-form.component';
import {PageSerialize} from '../infrastructure/page-serialize/page-serialize';
import {WebLoginComponent} from './presentation/login/web-login/web-login.component';
import {ConfiguracaoRepository} from "./repository/configuracao.repository";
import {ConfiguracaoService} from "./service/configuracao.service";
import {ConfiguracaoComponent} from "./presentation/dashboard/configuracao/configuracao.component";
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
import {TipoAvaliacaoRepository} from "./repository/tipo-avaliacao.repository";
import {AlterarTipoAvaliacaoComponent} from "./presentation/dashboard/tipo-avaliacao/alterar-tipo-avaliacao/alterar-tipo-avaliacao.component";
import {VincularTipoAvaliacaoComponent} from "./presentation/dashboard/unidade/visualizar-unidade/vincular-tipo-avaliacao/vincular-tipo-avaliacao.component";
import {UnidadeTipoAvaliacaoRepository} from "./repository/unidade-tipo-avaliacao.repository";
import {AvaliavelRepository} from "./repository/avaliavel.repository";
import {VisualizarTipoAvaliacaoComponent} from "./presentation/dashboard/tipo-avaliacao/visualizar-tipo-avaliacao/visualizar-tipo-avaliacao.component";
import {VisualizarDadosClienteComponent} from "./presentation/dashboard/cliente/visualizar-cliente/visualizar-dados-cliente/visualizar-dados-cliente.component";
import {ConsultarClientesComponent} from "./presentation/dashboard/cliente/consultar-clientes/consultar-clientes.component";
import {VisualizarClienteComponent} from "./presentation/dashboard/cliente/visualizar-cliente/visualizar-cliente.component";
import {ClienteViewComponent} from "./presentation/dashboard/cliente/cleinte-view.component";
import {UsuarioPessoaJuridicaFormComponent} from "./presentation/dashboard/cliente/inserir-cliente/cliente-form/pessoa-juridica/usuario-pessoa-juridica-form.component";
import {UsuarioPessoaFisicaFormComponent} from "./presentation/dashboard/cliente/inserir-cliente/cliente-form/pessoa-fisica/usuario-pessoa-fisica-form.component";
import {RecaptchaModule} from "ng-recaptcha";
import {ConsultarUsuariosComponent} from "./presentation/dashboard/atendente/consultar-atendentes/consultar-usuarios.component";
import {DispositivoRepository} from "./repository/dispositivo.repository";
import {DispositivoViewComponent} from "./presentation/dashboard/dispositivo/dispositivo-view.component";
import {OrderModule} from "ngx-order-pipe";
import {UnidadeTipoAvaliacaoDispositivoRepository} from "./repository/unidade-tipo-avaliacao-dispositivo.repository";
import {VincularUnidadeTipoAvaliacaoComponent} from "./presentation/dashboard/dispositivo/visualizar-dispositivo/vincular-unidade-tipo-avaliacao/vincular-unidade-tipo-avaliacao.component";
import {OpcoesMobileComponent} from "./presentation/dashboard/dispositivo/inserir-dispositivo/opcoes-mobile/opcoes-mobile.component";
import {OpcoesSiteComponent} from "./presentation/dashboard/dispositivo/inserir-dispositivo/opcoes-site/opcoes-site.component";
import {AssinaturaComponent} from "./presentation/dashboard/assinatura/assinatura.component";
import {AssinaturaRepository} from "./repository/assinatura.repository";
import {CartaoComponent} from "./presentation/dashboard/assinatura/dados-pagamento/cartao/cartao.component";
import {DadosPagamentoComponent} from "./presentation/dashboard/assinatura/dados-pagamento/dados-pagamento.component";
import {PlanosComponent} from "./presentation/dashboard/assinatura/planos/planos.component";
import {PlanoRepository} from "./repository/plano.repository";
import {DispositivoFormComponent} from "./presentation/dashboard/dispositivo/inserir-dispositivo/dispositivo-form/dispositivo-form.component";
import {AlterarDispositivoComponent} from "./presentation/dashboard/dispositivo/alterar-dispositivo/alterar-dispositivo.component";
import {ConsultarDispositivosComponent} from "./presentation/dashboard/dispositivo/consultar-dispositivos/consultar-dispositivos.component";
import {InserirDispositivoComponent} from "./presentation/dashboard/dispositivo/inserir-dispositivo/inserir-dispositivo.component";
import {VisualizarDispositivoComponent} from "./presentation/dashboard/dispositivo/visualizar-dispositivo/visualizar-dispositivo.component";
import {ErrorComponent} from "./presentation/controls/error/error.component";
import {FaturaViewComponent} from "./presentation/dashboard/fatura/fatura-view.component";
import {ConsultarFaturasComponent} from "./presentation/dashboard/fatura/consultar-faturas/consultar-faturas.component";
import {VisualizarFaturaComponent} from "./presentation/dashboard/fatura/visualizar-fatura/visualizar-fatura.component";
import {FaturaRepository} from "./repository/fatura.repository";
import {CupomRepository} from "./repository/cupom.repository";
import {CupomViewComponent} from "./presentation/dashboard/cupom/cupom-view.component";
import {ConsultarCuponsComponent} from "./presentation/dashboard/cupom/consultar-cupons/consultar-cupons.component";
import {VisualizarCupomComponent} from "./presentation/dashboard/cupom/visualizar-cupom/visualizar-cupom.component";
import {AlterarCupomComponent} from "./presentation/dashboard/cupom/alterar-cupom/alterar-cupom.component";
import {InserirCupomComponent} from "./presentation/dashboard/cupom/inserir-cupom/inserir-cupom.component";
import {CupomFormComponent} from "./presentation/dashboard/cupom/inserir-cupom/cupom-form/cupom-form.component";

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

    // usuários
    ConsultarUsuariosComponent,

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
    VisualizarTipoAvaliacaoComponent,
    ConsultarTiposAvaliacoesComponent,

    // Dispositivos
    DispositivoViewComponent,
    VisualizarDispositivoComponent,
    InserirDispositivoComponent,
    DispositivoFormComponent,
    ConsultarDispositivosComponent,
    AlterarDispositivoComponent,
    VincularUnidadeTipoAvaliacaoComponent,
    OpcoesMobileComponent,
    OpcoesSiteComponent,

    // Cliente
    InserirClienteComponent,
    ClienteFormComponent,
    ClienteViewComponent,
    VisualizarClienteComponent,
    VisualizarDadosClienteComponent,
    InserirClienteComponent,
    ClienteFormComponent,
    ConsultarClientesComponent,
    UsuarioPessoaFisicaFormComponent,
    UsuarioPessoaJuridicaFormComponent,

    // Assinatura
    AssinaturaComponent,
    DadosPagamentoComponent,
    CartaoComponent,
    PlanosComponent,

    // Faturas
    FaturaViewComponent,
    ConsultarFaturasComponent,
    VisualizarFaturaComponent,

    ErrorComponent
  ],
  imports: [
    WebSharedModule,
    CommonModule,
    BrowserModule,
    OrderModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    WebRoutingModule,
    RecaptchaModule,
    MatStepperModule
  ],
  entryComponents: [AlterarMinhaSenhaComponent, AlterarSenhaComponent, ConfirmDialogComponent, FotoLoadingComponent, InserirTipoAvaliacaoComponent],
  providers: [

    PageSerialize,

    UnidadeTipoAvaliacaoDispositivoRepository,
    UnidadeTipoAvaliacaoRepository,
    AvaliacaoAvaliavelRepository,
    TipoAvaliacaoRepository,
    ConfiguracaoRepository,
    AssinaturaRepository,
    AvaliavelRepository,
    AvaliacaoRepository,
    OperadorRepository,
    EnderecoRepository,
    UnidadeRepository,
    UsuarioRepository,
    FaturaRepository,
    CupomRepository,
    DispositivoRepository,
    ContaRepository,
    PlanoRepository,
    FileRepository,

    AuthenticationService,
    ConfiguracaoService,
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
