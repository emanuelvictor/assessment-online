import {HttpClientModule} from '@angular/common/http';
import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import {MaterializeModule} from 'angular2-materialize';
import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {SiteComponent} from './presentation/site.component';
import {InicioComponent} from './presentation/inicio/inicio.component';
import {SiteRoutingModule} from "./site-routing.module";
import {CommonModule} from "@angular/common";
import {AngularFireDatabase} from 'angularfire2/database';
import {PastoresViewComponent} from "./presentation/pastores/pastores-view.component";
import {ContatoComponent} from "./presentation/contato/contato.component";
import {VisualizarPastorComponent} from "./presentation/pastores/visualizar-pastor/visualizar-pastor.component";
import {MatIconModule, MatSnackBarModule} from "@angular/material";
import {EmConstrucaoComponent} from "./presentation/em-construcao/em-construcao.component";
import {LocalizacaoComponent} from "./presentation/localizacao/localizacao.component";
import {RodapeComponent} from "../application/controls/rodape/rodape.component";
import {MenuPrincipalComponent} from "../application/controls/menu-principal/menu-principal.component";
import {ScrollToModule} from '@nicky-lenaers/ngx-scroll-to';
import {EvCardComponent} from "../application/controls/ev-card/ev-card.component";
import {SiteSharedModule} from "../application/site-shared.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {environment} from "../../environments/environment.prod";

@NgModule({
  declarations: [

    // Controls
    RodapeComponent,
    EmConstrucaoComponent,
    MenuPrincipalComponent,
    EvCardComponent,

    SiteComponent,

    InicioComponent,

    LocalizacaoComponent,

    PastoresViewComponent,
    VisualizarPastorComponent,

    ContatoComponent
  ],
  imports: [
    SiteSharedModule,

    AngularFireModule.initializeApp(environment.firebase, 'ad-redencao'), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireStorageModule,

    CommonModule,

    BrowserAnimationsModule,
    SiteRoutingModule,
    MatIconModule,
    MatSnackBarModule,
    MaterializeModule,
    HttpClientModule,
    ScrollToModule.forRoot(),

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [

    AngularFireDatabase,

    {provide: LOCALE_ID, useValue: 'pt-BR'}

  ],
  bootstrap: [SiteComponent]
})
export class SiteModule {
}
