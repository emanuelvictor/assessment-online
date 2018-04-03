import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import 'hammerjs';
import {MobileComponent} from './presentation/mobile.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {Interceptor} from '../../web/application/interceptor/interceptor';
import {MobileRoutingModule} from './mobile.routing.module';
import {DateAdapter} from '@angular/material';
import {SharedModule} from '../../shared/shared.module';
import {AuthenticationService} from '../../web/domain/service/authentication.service';
import {EnderecoService} from '../../web/domain/service/endereco.service';
import {Describer} from '../../web/infrastructure/describer/describer';
import {UsuarioService} from '../../web/domain/service/usuario.service';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../../environments/environment';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {EnderecoRepository} from '../../web/domain/repository/endereco.repository';
import {UnidadeRepository} from '../../web/domain/repository/unidade.repository';
import {UsuarioRepository} from '../../web/domain/repository/usuario.repository';
import {AccountRepository} from '../../web/infrastructure/repository/account/account.repository';
import {UnidadeService} from '../../web/domain/service/unidade.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {AvaliarComponent} from './presentation/avaliacao/avaliar/avaliar.component';
import {AvaliacaoComponent} from './presentation/avaliacao/avaliacao.component';
import {ConclusaoComponent} from './presentation/avaliacao/conclusao/conclusao.component';
import {SelecionarUnidadeComponent} from './presentation/avaliacao/selecionar-unidade/selecionar-unidade.component';
import {MobileService} from './service/mobile.service';
import {SelecionarAtendentesComponent} from './presentation/avaliacao/selecionar-atendentes/selecionar-atendentes.component';
import {ColaboradorService} from '../../web/domain/service/colaborador.service';
import {ColaboradorRepository} from '../../web/domain/repository/colaborador.repository';
import {AvaliacaoService} from '../../web/domain/service/avaliacao.service';
import {AvaliacaoRepository} from '../../web/domain/repository/avaliacao.repository';
import {AvaliacaoColaboradorRepository} from '../../web/domain/repository/avaliacao-colaborador.repository';
import {FileRepository} from '../../web/infrastructure/repository/file/file.repository';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {MatGridListModule} from '@angular/material/grid-list';

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
    AvaliarComponent
  ],
  imports: [
    MatGridListModule,
    SharedModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MobileRoutingModule,

    AngularFireModule.initializeApp(environment.firebase, 'assessment-online'), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireStorageModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    Describer,
    FileRepository,
    ColaboradorRepository,
    EnderecoRepository,
    UnidadeRepository,
    UsuarioRepository,
    AccountRepository,
    AvaliacaoRepository,
    ColaboradorService,
    AvaliacaoColaboradorRepository,
    EnderecoService,
    UsuarioService,
    UnidadeService,
    AuthenticationService,
    AngularFireDatabase,
    MobileService,
    AvaliacaoService,

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
