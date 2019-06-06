import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "../../web/domain/presentation/login/login.component";
import {AvaliarComponent} from "./presentation/avaliacao/avaliar/avaliar.component";
import {AvaliacaoComponent} from "./presentation/avaliacao/avaliacao.component";
import {AuthenticationService} from "../../web/domain/service/authentication.service";
import {OfflineComponent} from "./presentation/avaliacao/offline/offline.component";
import {SelecionarAtendentesComponent} from "./presentation/avaliacao/avaliar/selecionar-nota-e-avaliaveis/selecionar-atendentes/selecionar-atendentes.component";
import {ConfigurarUnidadesEAvaliacoesComponent} from "./presentation/avaliacao/configurar/configurar-unidades-e-avaliacoes.component";
import {SelecionarUnidadeComponent} from "./presentation/avaliacao/avaliar/selecionar-unidade/selecionar-unidade.component";
import {SelecionarNotaComponent} from "./presentation/avaliacao/avaliar/selecionar-nota-e-avaliaveis/selecionar-nota/selecionar-nota.component";
import {SelecionarNotaEAvaliaveisComponent} from "./presentation/avaliacao/avaliar/selecionar-nota-e-avaliaveis/selecionar-nota-e-avaliaveis.component";
import {ConclusaoComponent} from "./presentation/avaliacao/avaliar/conclusao/conclusao.component";
import {FeedbackComponent} from "./presentation/avaliacao/avaliar/feedback/feedback.component";


const routes: Routes = [
  {path: '', redirectTo: 'avaliar', pathMatch: 'full'},
  {path: 'authentication', component: LoginComponent},
  {
    path: '', component: AvaliacaoComponent, canActivate: [AuthenticationService],
    children: [
      {path: 'configurar-unidades-e-avaliacoes', component: ConfigurarUnidadesEAvaliacoesComponent},
      {
        path: 'avaliar', component: AvaliarComponent,
        children: [
          {path: '', component: SelecionarUnidadeComponent},
          {
            path: ':unidadeId', component: SelecionarNotaEAvaliaveisComponent,
            children: [
              {path: ':ordem', component: SelecionarNotaComponent},
              {path: ':ordem/selecionar-atendentes', component: SelecionarAtendentesComponent},
              {path: ':ordem/conclusao', component: ConclusaoComponent},
              {path: ':ordem/feedback', component: FeedbackComponent},
            ]
          },
        ]
      },
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