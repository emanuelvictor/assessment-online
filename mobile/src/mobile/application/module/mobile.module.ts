import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {MobileRoutingModule} from '@src/mobile/application/module/routing/mobile-routing.module';
import {RootViewComponent} from '@src/mobile/application/presentation/root-view.component';
import {AvaliarComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/avaliar.component';
import {AvaliacaoComponent} from '@src/mobile/application/presentation/avaliacao/avaliacao.component';
import {RobotVerifyComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/conclusao/robot-verify/robot-verify.component';
import {ExecutarAvaliacaoComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/executar-avaliacao.component';
import {SelecionarNotaComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-nota/selecionar-nota.component';
import {SelecionarUnidadeComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/selecionar-unidade/selecionar-unidade.component';
import {AuthenticateToLogoutComponent} from '@src/mobile/application/presentation/avaliacao/configurar/configuracoes/authenticate-to-logout/authenticate-to-logout.component';
import {DateAdapter, MatGridListModule, MatRippleModule} from '@angular/material';
import {ConclusaoViewComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/conclusao/conclusao-view.component';
import {ConclusaoComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/conclusao/conclusao/conclusao.component';
import {FeedbackComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/feedback/feedback.component';
import {MobileErrorComponent} from '@src/mobile/application/presentation/controls/mobile-error/mobile-error.component';
import {CommonModule, registerLocaleData} from '@angular/common';
import {AuthenticatedSharedModule} from '@src/web/domain/presentation/authenticated/authenticated.shared.module';
import {SelecionarAtendentesComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-atendentes/selecionar-atendentes.component';
import {SelecionarNotaEItensAvaliaveisComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-nota-e-itens-avaliaveis.component';
import {ConfigurarUnidadesEAvaliacoesComponent} from '@src/mobile/application/presentation/avaliacao/configurar/configurar-unidades-e-avaliacoes.component';
import {EllipsisModule} from 'ngx-ellipsis';
import {ConfiguracoesComponent} from '@src/mobile/application/presentation/avaliacao/configurar/configuracoes/configuracoes.component';
import {RecaptchaModule} from 'ng-recaptcha';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {OrderModule} from 'ngx-order-pipe';
import {UnidadeTipoAvaliacaoRepository} from '@src/web/domain/repository/unidade-tipo-avaliacao.repository';
import {AvaliavelRepository} from '@src/web/domain/repository/avaliavel.repository';
import {EnderecoRepository} from '@src/web/domain/repository/endereco.repository';
import {DispositivoRepository} from '@src/web/domain/repository/dispositivo.repository';
import {AvaliacaoService} from '@src/web/domain/service/avaliacao.service';
import {Interceptor} from '@src/web/application/interceptor/interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ContaService} from '@src/web/domain/service/conta.service';
import {LocalStorage} from '@src/web/infrastructure/local-storage/local-storage';
import {MobileService} from '@src/mobile/domain/service/mobile.service';
import {CookieService} from 'ngx-cookie-service';
import {UnidadeService} from '@src/web/domain/service/unidade.service';
import {UsuarioService} from '@src/web/domain/service/usuario.service';
import {EnderecoService} from '@src/web/domain/service/endereco.service';
import {ConfiguracaoService} from '@src/web/domain/service/configuracao.service';
import {FileRepository} from '@src/web/infrastructure/repository/file/file.repository';
import {ContaRepository} from '@src/web/domain/repository/conta.repository';
import {UsuarioRepository} from '@src/web/domain/repository/usuario.repository';
import {UnidadeRepository} from '@src/web/domain/repository/unidade.repository';
import {OperadorRepository} from '@src/web/domain/repository/operador.repository';
import {AgrupadorRepository} from '@src/mobile/domain/repository/agrupador.repository';
import {AvaliacaoRepository} from '@src/web/domain/repository/avaliacao.repository';
import {PageSerialize} from '@src/web/infrastructure/page-serialize/page-serialize';
import {AvaliacaoAvaliavelRepository} from '@src/web/domain/repository/avaliacao-avaliavel-repository.service';
import {ConfiguracaoRepository} from '@src/web/domain/repository/configuracao.repository';
import localePt from '@angular/common/locales/pt';
import {HomeComponent} from '@src/mobile/application/presentation/home/home.component';

/**
 *
 */
@NgModule({
  declarations: [
    RootViewComponent,
    AvaliarComponent,
    ConclusaoViewComponent,
    ConclusaoComponent,
    RobotVerifyComponent,
    AvaliacaoComponent,
    SelecionarNotaComponent,
    ExecutarAvaliacaoComponent,
    SelecionarUnidadeComponent,
    SelecionarAtendentesComponent,
    SelecionarNotaEItensAvaliaveisComponent,
    FeedbackComponent,
    AuthenticateToLogoutComponent,
    ConfiguracoesComponent,
    ConfigurarUnidadesEAvaliacoesComponent,

    HomeComponent,

    MobileErrorComponent
  ],
  imports: [
    EllipsisModule,
    MatRippleModule,
    MatGridListModule,
    AuthenticatedSharedModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MobileRoutingModule,
    OrderModule,
    RecaptchaModule
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    PageSerialize,

    UnidadeTipoAvaliacaoRepository,
    AvaliacaoAvaliavelRepository,
    ConfiguracaoRepository,
    AvaliavelRepository,
    AvaliacaoRepository,
    AgrupadorRepository,
    OperadorRepository,
    EnderecoRepository,
    UnidadeRepository,
    UsuarioRepository,
    DispositivoRepository,
    ContaRepository,
    FileRepository,

    ConfiguracaoService,
    AvaliacaoService,
    EnderecoService,
    UsuarioService,
    UnidadeService,
    CookieService,
    MobileService,
    LocalStorage,
    ContaService,

    {provide: LOCALE_ID, useValue: 'pt-BR'},

    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    }
  ],
  bootstrap: [RootViewComponent]
})
export class MobileModule {
  constructor(public dateAdapter: DateAdapter<Date>) {
    registerLocaleData(localePt);
    dateAdapter.setLocale('pt-BR');
  }
}
