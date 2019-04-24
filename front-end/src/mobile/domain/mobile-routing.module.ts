import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "../../web/domain/presentation/login/login.component";
import {ConclusaoComponent} from "./presentation/avaliacao/conclusao/conclusao.component";
import {AvaliarComponent} from "./presentation/avaliacao/avaliar/avaliar.component";
import {SelecionarUnidadeComponent} from "./presentation/avaliacao/selecionar-unidade/selecionar-unidade.component";
import {AvaliacaoComponent} from "./presentation/avaliacao/avaliacao.component";
import {AuthenticationService} from "../../web/domain/service/authentication.service";
import {LogoutComponent} from "./presentation/avaliacao/logout/logout.component";
import {OfflineComponent} from "./presentation/avaliacao/offline/offline.component";
import {SelecionarAvaliacaoComponent} from "./presentation/avaliacao/selecionar-avaliacao/selecionar-avaliacao.component";
import {VisualizarAvaliacaoComponent} from "./presentation/avaliacao/avaliar/visualizar-avaliacao/visualizar-avaliacao.component";
import {SelecionarAtendentesComponent} from "./presentation/avaliacao/avaliar/selecionar-atendentes/selecionar-atendentes.component";
import {FeedbackComponent} from "./presentation/avaliacao/feedback/feedback.component";


const routes: Routes = [
  {path: '', redirectTo: 'avaliar/1', pathMatch: 'full'},
  {path: 'authentication', component: LoginComponent},
  {
    path: '', component: AvaliacaoComponent, canActivate: [AuthenticationService],
    children: [
      {path: 'selecionar-unidade', component: SelecionarUnidadeComponent},
      {path: 'selecionar-avaliacao', component: SelecionarAvaliacaoComponent},
      {
        path: 'avaliar', component: AvaliarComponent,
        children: [
          {path: ':ordem', component: VisualizarAvaliacaoComponent},
          {path: ':ordem/selecionar-atendentes', component: SelecionarAtendentesComponent},
        ]
      },
      {path: 'feedback', component: FeedbackComponent},
      {path: 'conclusao', component: ConclusaoComponent},
      {path: 'logout', component: LogoutComponent},
    ]
  },
  {path: 'offline', component: OfflineComponent}
];

/**
 *
 */
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: []
})
export class MobileRoutingModule {
}
