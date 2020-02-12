import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {NativeScriptModule} from 'nativescript-angular/nativescript.module';

import {RootViewComponent} from '@src/mobile/application/presentation/root-view.component';
import {HomeComponent} from '@src/mobile/application/presentation/home/home.component';
import {MobileRoutingModule} from '@src/mobile/application/presentation/mobile-routing.module';
import {ConfigurarUnidadesEAvaliacoesComponent} from '@src/mobile/application/presentation/avaliacao/configurar/configurar-unidades-e-avaliacoes.component';
import {ConfiguracoesComponent} from '@src/mobile/application/presentation/avaliacao/configurar/configuracoes/configuracoes.component';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {MobileService} from '@src/mobile/domain/service/mobile.service';
import {HttpClientModule} from '@angular/common/http';
import {DispositivoRepository} from '@src/sistema/domain/repository/dispositivo.repository';
import {ConfiguracaoRepository} from '@src/sistema/domain/repository/configuracao.repository';
import {LocalStorage} from '@src/sistema/infrastructure/local-storage/local-storage';
import {CookieService} from 'ngx-cookie-service';
import {MatSnackBarModule} from "@angular/material/snack-bar";


// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from 'nativescript-angular/forms';

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';

@NgModule({
  declarations: [
    RootViewComponent,
    HomeComponent,
    ConfiguracoesComponent,
    ConfigurarUnidadesEAvaliacoesComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    MatSnackBarModule,

    // NativeScriptModule,
    MobileRoutingModule,
  ],
  providers: [
    MobileService,
    DispositivoRepository,
    ConfiguracaoRepository,
    LocalStorage,
    CookieService
  ],
  bootstrap: [RootViewComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MobileModule { }
