import {LOCALE_ID, NgModule} from '@angular/core';
import 'hammerjs';
import {AuthenticationService} from '../../domain/service/authentication.service';
import {DateAdapter} from '@angular/material';
import {EnderecoService} from '../../domain/service/endereco.service';
import {UsuarioService} from '../../domain/service/usuario.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {Interceptor} from '../interceptor/interceptor';
import {SistemaRoutingModule} from './sistema.routing.module';
import {CommonModule, registerLocaleData} from '@angular/common';
import {UnidadeService} from '../../domain/service/unidade.service';
import {FileRepository} from '../../infrastructure/repository/file/file.repository';
import {AvaliacaoService} from '../../domain/service/avaliacao.service';
import localePt from '@angular/common/locales/pt';
import {UsuarioRepository} from '../../domain/repository/usuario.repository';
import {UnidadeRepository} from '../../domain/repository/unidade.repository';
import {EnderecoRepository} from '../../domain/repository/endereco.repository';
import {AvaliacaoRepository} from '../../domain/repository/avaliacao.repository';
import {OperadorRepository} from '../../domain/repository/operador.repository';
import {AvaliacaoAvaliavelRepository} from '../../domain/repository/avaliacao-avaliavel-repository.service';
import {ContaRepository} from '../../domain/repository/conta.repository';
import {ContaService} from '../../domain/service/conta.service';
import {PageSerialize} from '../../infrastructure/page-serialize/page-serialize';
import {ConfiguracaoRepository} from '../../domain/repository/configuracao.repository';
import {ConfiguracaoService} from '../../domain/service/configuracao.service';
import {LocalStorage} from '../../infrastructure/local-storage/local-storage';
import {CookieService} from 'ngx-cookie-service';
import {TipoAvaliacaoRepository} from '../../domain/repository/tipo-avaliacao.repository';
import {UnidadeTipoAvaliacaoRepository} from '../../domain/repository/unidade-tipo-avaliacao.repository';
import {AvaliavelRepository} from '../../domain/repository/avaliavel.repository';
import {DispositivoRepository} from '../../domain/repository/dispositivo.repository';
import {UnidadeTipoAvaliacaoDispositivoRepository} from '../../domain/repository/unidade-tipo-avaliacao-dispositivo.repository';
import {AssinaturaRepository} from '../../domain/repository/assinatura.repository';
import {PlanoRepository} from '../../domain/repository/plano.repository';
import {FaturaRepository} from '../../domain/repository/fatura.repository';
import {CupomRepository} from '../../domain/repository/cupom.repository';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SistemaSharedModule} from './sistema.shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {SistemaComponent} from './sistema.component';

registerLocaleData(localePt, 'pt-BR');

/**
 *
 */
@NgModule({
  declarations: [

    // Bootstrap
    SistemaComponent,

  ],
  imports: [
    SistemaSharedModule,
    BrowserAnimationsModule,
    BrowserModule,

    FormsModule,
    ReactiveFormsModule,
    CommonModule,

    SistemaRoutingModule,

  ],
  entryComponents: [],
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
    },
  ],
  bootstrap: [SistemaComponent]
})
export class SistemaModule {
  constructor(public dateAdapter: DateAdapter<Date>) {
    registerLocaleData(localePt);
    dateAdapter.setLocale('pt-BR');
  }
}
