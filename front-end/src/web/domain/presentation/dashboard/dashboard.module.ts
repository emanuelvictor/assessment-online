import {LOCALE_ID, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FilterPipe} from "../controls/filter-pipe/filter";
import {DataNascimentoValidator} from "../controls/validators/validators";
import {AutofocusDirective} from "../controls/autofocus/autofocus";
import {CurrencyFormatPipe} from "../controls/currency-pipe-brl/currency-pipe-brl";
import {RatingComponent} from "../controls/rating/rating.component";
import {LongPressDirective} from "../controls/long-press/long-press.directive";
import {StopPropagationDirective} from "../controls/stop-propagation/stop-propagation.directive";
import {GroupByPipe} from "../controls/group-by-pipe/group-by";
import {OrderByPipe} from "../controls/order-by-pipe/order-by";
import {SomenteAlfanumericos} from "../controls/patterns/somente-alfanumericos";
import {SomenteLetras} from "../controls/patterns/somente-letras";
import {SomenteNumeros} from "../controls/patterns/somente-numeros";
import {SomenteNumerosPositivos} from "../controls/patterns/somente-numeros-positivos";
import {CroppablePhotoComponent} from "../controls/croppable-photo/croppable-photo.component";
import {ConfiguracaoComponent} from "./configuracao/configuracao.component";
import {AtendenteViewComponent} from "./atendente/atendente-view.component";
import {DashboardViewComponent} from "./dashboard-view.component";
import {MinhaContaViewComponent} from "./minha-conta/minha-conta-view.component";
import {VisualizarDadosUsuarioComponent} from "./atendente/visualizar-atendente/visualizar-dados-usuario/visualizar-dados-usuario.component";
import {VisualizarMinhaContaComponent} from "./minha-conta/visualizar-minha-conta/visualizar-minha-conta.component";
import {AlterarMinhaContaComponent} from "./minha-conta/alterar-minha-conta/alterar-minha-conta.component";
import {ConsultarAtendentesComponent} from "./atendente/consultar-atendentes/consultar-atendentes.component";
import {AtendenteFormComponent} from "./atendente/inserir-atendente/usuario-form/usuario-form.component";
import {MapsComponent} from "../controls/maps/maps.component";
import {InserirAtendenteComponent} from "./atendente/inserir-atendente/inserir-atendente.component";
import {AlterarAtendenteComponent} from "./atendente/alterar-atendente/alterar-atendente.component";
import {VisualizarAtendenteComponent} from "./atendente/visualizar-atendente/visualizar-atendente.component";
import {VincularUnidadeComponent} from "./atendente/visualizar-atendente/vincular-unidade/vincular-unidade.component";
import {VisualizarVinculoUnidadeComponent} from "./atendente/visualizar-atendente/visualizar-vinculo-unidade/visualizar-vinculo-unidade.component";
import {EstatisticasAtendenteComponent} from "./atendente/visualizar-atendente/estatisticas/estatisticas-atendente.component";
import {MinhasEstatisticasComponent} from "./minha-conta/visualizar-minha-conta/estatisticas/minhas-estatisticas.component";
import {ConsultarUsuariosComponent} from "./atendente/consultar-atendentes/consultar-usuarios.component";
import {AlterarMinhaSenhaComponent} from "./minha-conta/visualizar-minha-conta/alterar-minha-senha/alterar-minha-senha.component";
import {AlterarSenhaComponent} from "./atendente/visualizar-atendente/alterar-senha/alterar-senha.component";
import {UnidadeViewComponent} from "./unidade/unidade-view.component";
import {ListaUnidadesComponent} from "./unidade/consultar-unidades/lista-unidades/lista-unidades.component";
import {ConsultarUnidadesComponent} from "./unidade/consultar-unidades/consultar-unidades.component";
import {AlterarUnidadeComponent} from "./unidade/alterar-unidade/alterar-unidade.component";
import {VisualizarUnidadeComponent} from "./unidade/visualizar-unidade/visualizar-unidade.component";
import {InserirUnidadeComponent} from "./unidade/inserir-unidade/inserir-unidade.component";
import {UnidadeFormComponent} from "./unidade/inserir-unidade/unidade-form/unidade-form.component";
import {UnidadeItemComponent} from "./atendente/consultar-atendentes/unidade-item/unidade-item.component";
import {EstatisticasUnidadeComponent} from "./unidade/visualizar-unidade/estatisticas/estatisticas-unidade.component";
import {VincularTipoAvaliacaoComponent} from "./unidade/visualizar-unidade/vincular-tipo-avaliacao/vincular-tipo-avaliacao.component";
import {AvaliacaoViewComponent} from "./avaliacao/avaliacao-view.component";
import {ConsultarAvaliacoesComponent} from "./avaliacao/consultar-avaliacoes/consultar-avaliacoes.component";
import {VisualizarAvaliacaoComponent} from "./avaliacao/visualizar-avaliacao/visualizar-avaliacao.component";
import {TipoAvaliacaoViewComponent} from "./tipo-avaliacao/tipo-avaliacao-view.component";
import {AlterarTipoAvaliacaoComponent} from "./tipo-avaliacao/alterar-tipo-avaliacao/alterar-tipo-avaliacao.component";
import {InserirTipoAvaliacaoComponent} from "./tipo-avaliacao/inserir-tipo-avaliacao/inserir-tipo-avaliacao.component";
import {TipoAvaliacaoFormComponent} from "./tipo-avaliacao/inserir-tipo-avaliacao/tipo-avaliacao-form/tipo-avaliacao-form.component";
import {VisualizarTipoAvaliacaoComponent} from "./tipo-avaliacao/visualizar-tipo-avaliacao/visualizar-tipo-avaliacao.component";
import {ConsultarTiposAvaliacoesComponent} from "./tipo-avaliacao/consultar-tipos-avaliacoes/consultar-tipos-avaliacoes.component";
import {DispositivoViewComponent} from "./dispositivo/dispositivo-view.component";
import {VisualizarDispositivoComponent} from "./dispositivo/visualizar-dispositivo/visualizar-dispositivo.component";
import {InserirDispositivoComponent} from "./dispositivo/inserir-dispositivo/inserir-dispositivo.component";
import {DispositivoFormComponent} from "./dispositivo/inserir-dispositivo/dispositivo-form/dispositivo-form.component";
import {ConsultarDispositivosComponent} from "./dispositivo/consultar-dispositivos/consultar-dispositivos.component";
import {AlterarDispositivoComponent} from "./dispositivo/alterar-dispositivo/alterar-dispositivo.component";
import {VincularUnidadeTipoAvaliacaoComponent} from "./dispositivo/visualizar-dispositivo/vincular-unidade-tipo-avaliacao/vincular-unidade-tipo-avaliacao.component";
import {OpcoesMobileComponent} from "./dispositivo/inserir-dispositivo/opcoes-mobile/opcoes-mobile.component";
import {OpcoesSiteComponent} from "./dispositivo/inserir-dispositivo/opcoes-site/opcoes-site.component";
import {ClienteViewComponent} from "./cliente/cleinte-view.component";
import {VisualizarClienteComponent} from "./cliente/visualizar-cliente/visualizar-cliente.component";
import {VisualizarDadosClienteComponent} from "./cliente/visualizar-cliente/visualizar-dados-cliente/visualizar-dados-cliente.component";
import {ConsultarClientesComponent} from "./cliente/consultar-clientes/consultar-clientes.component";
import {AssinaturaComponent} from "./assinatura/assinatura.component";
import {DadosPagamentoComponent} from "./assinatura/dados-pagamento/dados-pagamento.component";
import {CartaoComponent} from "./assinatura/dados-pagamento/cartao/cartao.component";
import {PlanosComponent} from "./assinatura/planos/planos.component";
import {FaturaViewComponent} from "./fatura/fatura-view.component";
import {ConsultarFaturasComponent} from "./fatura/consultar-faturas/consultar-faturas.component";
import {VisualizarFaturaComponent} from "./fatura/visualizar-fatura/visualizar-fatura.component";
import {DashboardSharedModule} from "./dashboard.shared.module";
import {OrderModule} from "ngx-order-pipe";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {MatStepperModule} from "@angular/material";
import {ConfirmDialogComponent} from "../controls/confirm-dialog/confirm-dialog.component";
import {FotoLoadingComponent} from "../controls/foto-loading/foto-loading.component";
import {PageSerialize} from "../../../infrastructure/page-serialize/page-serialize";
import {UnidadeTipoAvaliacaoDispositivoRepository} from "../../repository/unidade-tipo-avaliacao-dispositivo.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../repository/unidade-tipo-avaliacao.repository";
import {AvaliacaoAvaliavelRepository} from "../../repository/avaliacao-avaliavel-repository.service";
import {TipoAvaliacaoRepository} from "../../repository/tipo-avaliacao.repository";
import {ConfiguracaoRepository} from "../../repository/configuracao.repository";
import {AssinaturaRepository} from "../../repository/assinatura.repository";
import {AvaliavelRepository} from "../../repository/avaliavel.repository";
import {AvaliacaoRepository} from "../../repository/avaliacao.repository";
import {OperadorRepository} from "../../repository/operador.repository";
import {EnderecoRepository} from "../../repository/endereco.repository";
import {UnidadeRepository} from "../../repository/unidade.repository";
import {UsuarioRepository} from "../../repository/usuario.repository";
import {FaturaRepository} from "../../repository/fatura.repository";
import {CupomRepository} from "../../repository/cupom.repository";
import {DispositivoRepository} from "../../repository/dispositivo.repository";
import {ContaRepository} from "../../repository/conta.repository";
import {PlanoRepository} from "../../repository/plano.repository";
import {FileRepository} from "../../../infrastructure/repository/file/file.repository";
import {AuthenticationService} from "../../service/authentication.service";
import {ConfiguracaoService} from "../../service/configuracao.service";
import {AvaliacaoService} from "../../service/avaliacao.service";
import {EnderecoService} from "../../service/endereco.service";
import {UsuarioService} from "../../service/usuario.service";
import {UnidadeService} from "../../service/unidade.service";
import {CookieService} from "ngx-cookie-service";
import {LocalStorage} from "../../../infrastructure/local-storage/local-storage";
import {ContaService} from "../../service/conta.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {Interceptor} from "../../../application/interceptor/interceptor";
import {DashboardRoutingModule} from "./dashboard.routing.module";


/**
 *
 */
@NgModule({
  declarations: [

    // Controls
    FilterPipe,
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
    MapsComponent,
    InserirAtendenteComponent,
    AlterarAtendenteComponent,
    VisualizarAtendenteComponent,
    VincularUnidadeComponent,
    VisualizarVinculoUnidadeComponent,
    EstatisticasAtendenteComponent,
    MinhasEstatisticasComponent,

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
    ClienteViewComponent,
    VisualizarClienteComponent,
    VisualizarDadosClienteComponent,
    ConsultarClientesComponent,

    // Assinatura
    AssinaturaComponent,
    DadosPagamentoComponent,
    CartaoComponent,
    PlanosComponent,

    // Faturas
    FaturaViewComponent,
    ConsultarFaturasComponent,
    VisualizarFaturaComponent
  ],
  imports: [
    DashboardSharedModule,
    CommonModule,

    OrderModule,
    NgxChartsModule,
    MatStepperModule,
    DashboardRoutingModule,
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
  ]
})
export class DashboardModule {
}