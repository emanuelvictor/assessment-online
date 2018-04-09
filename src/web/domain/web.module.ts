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
import {Describer} from '../infrastructure/describer/describer';
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
import {WebRoutingModule} from './web.routing.module';
import {WebComponent} from './presentation/web.component';
import {SharedModule} from '../../shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule, registerLocaleData} from '@angular/common';
import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {environment} from '../../environments/environment';
import {AngularFireDatabase} from 'angularfire2/database';
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
import {UsuarioRepository} from './repository/usuario.repository';
import {AccountRepository} from '../infrastructure/repository/account/account.repository';
import {UnidadeRepository} from './repository/unidade.repository';
import {EnderecoRepository} from './repository/endereco.repository';
import {VisualizarDadosUsuarioComponent} from './presentation/dashboard/atendente/visualizar-atendente/visualizar-dados-usuario/visualizar-dados-usuario.component';
import {VincularUnidadeComponent} from './presentation/dashboard/atendente/visualizar-atendente/vincular-unidade/vincular-unidade.component';
import {VisualizarVinculoUnidadeComponent} from './presentation/dashboard/atendente/visualizar-atendente/visualizar-vinculo-unidade/visualizar-vinculo-unidade.component';
import {ColaboradorService} from './service/colaborador.service';
import {ColaboradorRepository} from './repository/colaborador.repository';
import {FileRepository} from '../infrastructure/repository/file/file.repository';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {FotoLoadingComponent} from './presentation/controls/foto-loading/foto-loading.component';
import {AvaliacaoColaboradorRepository} from './repository/avaliacao-colaborador.repository';
import {EstatisticasAtendenteComponent} from './presentation/dashboard/atendente/visualizar-atendente/estatisticas/estatisticas-atendente.component';
import {AvaliacaoService} from './service/avaliacao.service';
import {AvaliacaoRepository} from './repository/avaliacao.repository';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {EstatisticasUnidadeComponent} from './presentation/dashboard/unidade/visualizar-unidade/estatisticas/estatisticas-unidade.component';
import localePt from '@angular/common/locales/pt';
import {EvDatepicker} from './presentation/controls/ev-datepicker/ev-datepicker';
import {ListaUnidadesComponent} from './presentation/dashboard/unidade/consultar-unidades/lista-unidades/lista-unidades.component';
import {ConsultarUnidadesComponent} from './presentation/dashboard/unidade/consultar-unidades/consultar-unidades.component';
import {UnidadeRankingComponent} from './presentation/dashboard/ranking/unidade/unidade-ranking/unidade-ranking.component';
import {UnidadeRankingViewComponent} from './presentation/dashboard/ranking/unidade/unidade-ranking-view.component';
import {AtendenteRankingComponent} from './presentation/dashboard/ranking/atendente/atendente-ranking/atendente-ranking.component';
import {AtendenteRankingViewComponent} from './presentation/dashboard/ranking/atendente/atendente-ranking-view.component';
import {RankingComponent} from './presentation/dashboard/ranking/ranking.component';
import {SelecionarUnidadeComponent} from './presentation/dashboard/ranking/atendente/selecionar-unidade/selecionar-unidade.component';
import {MinhasEstatisticasComponent} from './presentation/dashboard/minha-conta/visualizar-minha-conta/estatisticas/minhas-estatisticas.component';
import {SearchBarComponent} from "./presentation/controls/search-bar/search-bar.component";
import {FilterPipe} from "./presentation/controls/filter-pipe/filter";

registerLocaleData(localePt, 'pt-BR');

/**
 *
 */
@NgModule({
  declarations: [

    CpfValidator,
    CnpjValidator,
    DataNascimentoValidator,
    CurrencyFormatPipe,
    FilterPipe,

    RatingComponent,
    LongPressDirective,

    StopPropagationDirective,
    GroupByPipe,
    OrderByPipe,

    SomenteAlfanumericos,
    SomenteLetras,
    SomenteNumeros,
    SomenteNumerosPositivos,

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

    // Ranking
    SelecionarUnidadeComponent,
    UnidadeRankingComponent,
    UnidadeRankingViewComponent,
    AtendenteRankingComponent,
    AtendenteRankingViewComponent,
    RankingComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    WebRoutingModule,
    MatExpansionModule,
    AngularFireModule.initializeApp(environment.firebase, 'assessment-online'), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireStorageModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [AlterarMinhaSenhaComponent, AlterarSenhaComponent, ConfirmDialogComponent, FotoLoadingComponent],
  providers: [
    Describer,
    AvaliacaoColaboradorRepository,
    ColaboradorRepository,
    AvaliacaoRepository,
    EnderecoRepository,
    UnidadeRepository,
    UsuarioRepository,
    AccountRepository,
    FileRepository,
    AuthenticationService,
    ColaboradorService,
    AvaliacaoService,
    EnderecoService,
    UsuarioService,
    UnidadeService,

    AngularFireDatabase,

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
    dateAdapter.setLocale('pt-BR');
  }
}
