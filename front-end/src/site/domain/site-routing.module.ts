import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InicioComponent} from "./presentation/inicio/inicio.component";
import {PastoresViewComponent} from "./presentation/pastores/pastores-view.component";
import {ContatoComponent} from "./presentation/contato/contato.component";
import {VisualizarPastorComponent} from "./presentation/pastores/visualizar-pastor/visualizar-pastor.component";
import {EmConstrucaoComponent} from "./presentation/em-construcao/em-construcao.component";
import {LocalizacaoComponent} from "./presentation/localizacao/localizacao.component";

const routes: Routes = [
  {
    path: 'em-construcao', component: EmConstrucaoComponent
  },
  {
    path: '', component: InicioComponent,
  },
  {
    path: 'localizacao', component: LocalizacaoComponent
  },
  {
    path: 'contato', component: ContatoComponent
  },
  {
    path: 'pastores', component: PastoresViewComponent,
    children: [
      {path: ':nome', component: VisualizarPastorComponent},
    ]
  }
];

/**
 *
 */
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: []
})
export class SiteRoutingModule {
}
