import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import 'hammerjs';
import {MobileComponent} from './presentation/mobile.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {Interceptor} from '../../web/application/interceptor/interceptor';
import {MobileRoutingModule} from './mobile.routing.module';
import {DateAdapter, MatRippleModule} from '@angular/material';
import {SharedModule} from '../../shared/shared.module';
import {AuthenticationService} from '../../web/domain/service/authentication.service';
import {EnderecoService} from '../../web/domain/service/endereco.service';
import {UsuarioService} from '../../web/domain/service/usuario.service';
import {UnidadeService} from '../../web/domain/service/unidade.service';
import {AvaliarComponent} from './presentation/avaliacao/avaliar/avaliar.component';
import {AvaliacaoComponent} from './presentation/avaliacao/avaliacao.component';
import {ConclusaoComponent} from './presentation/avaliacao/conclusao/conclusao.component';
import {SelecionarUnidadeComponent} from './presentation/avaliacao/selecionar-unidade/selecionar-unidade.component';
import {SelecionarAtendentesComponent} from './presentation/avaliacao/selecionar-atendentes/selecionar-atendentes.component';
import {ColaboradorService} from '../../web/domain/service/colaborador.service';
import {AvaliacaoService} from '../../web/domain/service/avaliacao.service';
import {FileRepository} from '../../web/infrastructure/repository/file/file.repository';
import {MatGridListModule} from '@angular/material/grid-list';
import {EllipsisModule} from 'ngx-ellipsis';
import {AvaliacaoRepository} from '../../web/domain/repositories/avaliacao.repository';
import {UsuarioRepository} from '../../web/domain/repositories/usuario.repository';
import {AvaliacaoColaboradorRepository} from '../../web/domain/repositories/avaliacao-colaborador.repository';
import {ColaboradorRepository} from '../../web/domain/repositories/colaborador.repository';
import {EnderecoRepository} from '../../web/domain/repositories/endereco.repository';
import {UnidadeRepository} from '../../web/domain/repositories/unidade.repository';
import {ContaRepository} from '../../web/domain/repositories/conta.repository';
import {ContaService} from '../../web/domain/service/conta.service';
import {PageSerialize} from '../../web/infrastructure/page-serialize/page-serialize';
import {MobileService} from "./service/mobile.service";
import {MobileLoginComponent} from './presentation/login/web-login/mobile-login.component';
import {ConfiguracaoRepository} from "../../web/domain/repositories/configuracao.repository";
import {ConfiguracaoService} from "../../web/domain/service/configuracao.service";

/**
 *
 */
@NgModule({
  declarations: [
    MobileComponent,
    SelecionarUnidadeComponent,
    SelecionarAtendentesComponent,
    ConclusaoComponent,
    AvaliacaoComponent,
    AvaliarComponent,

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
    BrowserAnimationsModule,
    MobileRoutingModule,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    PageSerialize,
    ConfiguracaoRepository,
    AvaliacaoColaboradorRepository,
    ColaboradorRepository,
    AvaliacaoRepository,
    EnderecoRepository,
    UnidadeRepository,
    UsuarioRepository,
    FileRepository,
    ContaRepository,

    AuthenticationService,
    ConfiguracaoService,
    ColaboradorService,
    AvaliacaoService,
    EnderecoService,
    UsuarioService,
    UnidadeService,
    MobileService,
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
    dateAdapter.setLocale('pt-BR');
  }
}
