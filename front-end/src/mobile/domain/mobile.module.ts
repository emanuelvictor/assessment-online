import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import 'hammerjs';
import {MobileComponent} from './presentation/mobile.component';
import {CommonModule, registerLocaleData} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {MobileRoutingModule} from './mobile-routing.module';
import {DateAdapter, MatRippleModule} from '@angular/material';
import {SharedModule} from '../../shared/shared.module';
import {AuthenticationService} from '../../web/domain/service/authentication.service';
import {EnderecoService} from '../../web/domain/service/endereco.service';
import {UsuarioService} from '../../web/domain/service/usuario.service';
import {UnidadeService} from '../../web/domain/service/unidade.service';
import {AvaliarComponent} from './presentation/avaliacao/avaliar/avaliar.component';
import {AvaliacaoComponent} from './presentation/avaliacao/avaliacao.component';
import {ConclusaoComponent} from './presentation/avaliacao/conclusao/conclusao.component';
import {AvaliacaoService} from '../../web/domain/service/avaliacao.service';
import {FileRepository} from '../../web/infrastructure/repository/file/file.repository';
import {MatGridListModule} from '@angular/material/grid-list';
import {EllipsisModule} from 'ngx-ellipsis';
import {AvaliacaoRepository} from '../../web/domain/repositories/avaliacao.repository';
import {UsuarioRepository} from '../../web/domain/repositories/usuario.repository';
import {AvaliacaoAvaliavelRepository} from '../../web/domain/repositories/avaliacao-avaliavel-repository.service';
import {EnderecoRepository} from '../../web/domain/repositories/endereco.repository';
import {UnidadeRepository} from '../../web/domain/repositories/unidade.repository';
import {ContaRepository} from '../../web/domain/repositories/conta.repository';
import {ContaService} from '../../web/domain/service/conta.service';
import {PageSerialize} from '../../web/infrastructure/page-serialize/page-serialize';
import {MobileService} from "./service/mobile.service";
import {MobileLoginComponent} from './presentation/login/web-login/mobile-login.component';
import {ConfiguracaoRepository} from "../../web/domain/repositories/configuracao.repository";
import {ConfiguracaoService} from "../../web/domain/service/configuracao.service";
import {LogoutComponent} from "./presentation/avaliacao/logout/logout.component";
import {LocalStorage} from "../../web/infrastructure/local-storage/local-storage";
import {CookieService} from "ngx-cookie-service";
import localePt from "@angular/common/locales/pt";
import {OperadorRepository} from "../../web/domain/repositories/operador.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../web/domain/repositories/unidade-tipo-avaliacao.repository";
import {OrderModule} from "ngx-order-pipe";
import {SelecionarAtendentesComponent} from "./presentation/avaliacao/avaliar/selecionar-atendentes/selecionar-atendentes.component";
import {AvaliavelRepository} from "../../web/domain/repositories/avaliavel.repository";
import {Interceptor} from "../../web/application/interceptor/interceptor";
import {FeedbackComponent} from "./presentation/avaliacao/feedback/feedback.component";
import {ConfigurarUnidadesEAvaliacoesComponent} from "./presentation/avaliacao/configurar/configurar-unidades-e-avaliacoes.component";
import {SelecionarUnidadeComponent} from "./presentation/avaliacao/selecionar-unidade/selecionar-unidade.component";
import {VisualizarAvaliacaoComponent} from "../../web/domain/presentation/dashboard/avaliacao/visualizar-avaliacao/visualizar-avaliacao.component";
import {SelecionarAvaliacaoComponent} from "./presentation/avaliacao/avaliar/selecionar-avaliacao/selecionar-avaliacao.component";

/**
 *
 */
@NgModule({
  declarations: [

    LogoutComponent,
    MobileComponent,
    AvaliarComponent,
    ConclusaoComponent,
    AvaliacaoComponent,
    SelecionarUnidadeComponent,
    SelecionarAvaliacaoComponent,
    SelecionarAtendentesComponent,
    ConfigurarUnidadesEAvaliacoesComponent,
    FeedbackComponent,
    // Authentication
    MobileLoginComponent
  ],
  imports: [
    EllipsisModule,
    MatRippleModule,
    MatGridListModule,
    SharedModule,
    CommonModule,
    BrowserModule,
    OrderModule,
    BrowserAnimationsModule,
    MobileRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    PageSerialize,

    UnidadeTipoAvaliacaoRepository,
    AvaliacaoAvaliavelRepository,
    ConfiguracaoRepository,
    AvaliavelRepository,
    AvaliacaoRepository,
    OperadorRepository,
    EnderecoRepository,
    UnidadeRepository,
    UsuarioRepository,
    FileRepository,
    ContaRepository,

    AuthenticationService,
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
  bootstrap: [MobileComponent]
})
export class MobileModule {
  constructor(public dateAdapter: DateAdapter<Date>) {
    registerLocaleData(localePt);
    dateAdapter.setLocale('pt-BR');
  }
}
