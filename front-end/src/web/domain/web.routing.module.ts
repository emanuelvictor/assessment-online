import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardViewComponent} from './presentation/dashboard/dashboard-view.component';
import {VisualizarMinhaContaComponent} from './presentation/dashboard/minha-conta/visualizar-minha-conta/visualizar-minha-conta.component';
import {AlterarMinhaContaComponent} from './presentation/dashboard/minha-conta/alterar-minha-conta/alterar-minha-conta.component';
import {MinhaContaViewComponent} from './presentation/dashboard/minha-conta/minha-conta-view.component';
import {VisualizarAtendenteComponent} from './presentation/dashboard/atendente/visualizar-atendente/visualizar-atendente.component';
import {LoginComponent} from './presentation/login/login.component';
import {ConsultarAtendentesComponent} from './presentation/dashboard/atendente/consultar-atendentes/consultar-atendentes.component';
import {InserirAtendenteComponent} from './presentation/dashboard/atendente/inserir-atendente/inserir-atendente.component';
import {AlterarAtendenteComponent} from './presentation/dashboard/atendente/alterar-atendente/alterar-atendente.component';
import {AtendenteViewComponent} from './presentation/dashboard/atendente/atendente-view.component';
import {UnidadeViewComponent} from './presentation/dashboard/unidade/unidade-view.component';
import {AlterarUnidadeComponent} from './presentation/dashboard/unidade/alterar-unidade/alterar-unidade.component';
import {InserirUnidadeComponent} from './presentation/dashboard/unidade/inserir-unidade/inserir-unidade.component';
import {VisualizarUnidadeComponent} from './presentation/dashboard/unidade/visualizar-unidade/visualizar-unidade.component';
import {AuthenticationService} from './service/authentication.service';
import {EstatisticasAtendenteComponent} from './presentation/dashboard/atendente/visualizar-atendente/estatisticas/estatisticas-atendente.component';
import {EstatisticasUnidadeComponent} from './presentation/dashboard/unidade/visualizar-unidade/estatisticas/estatisticas-unidade.component';
import {ConsultarUnidadesComponent} from './presentation/dashboard/unidade/consultar-unidades/consultar-unidades.component';
import {UnidadeRankingComponent} from './presentation/dashboard/ranking/unidade/unidade-ranking/unidade-ranking.component';
import {UnidadeRankingViewComponent} from './presentation/dashboard/ranking/unidade/unidade-ranking-view.component';
import {AtendenteRankingViewComponent} from './presentation/dashboard/ranking/atendente/atendente-ranking-view.component';
import {AtendenteRankingComponent} from './presentation/dashboard/ranking/atendente/atendente-ranking/atendente-ranking.component';
import {MinhasEstatisticasComponent} from './presentation/dashboard/minha-conta/visualizar-minha-conta/estatisticas/minhas-estatisticas.component';
import {InserirClienteComponent} from './presentation/dashboard/cliente/inserir-cliente.component';
import {WebLoginComponent} from './presentation/login/web-login/web-login.component';


const routes: Routes = [
  {
    path: '', redirectTo: 'dashboard/minha-conta', pathMatch: 'full'
  },
  {
    path: 'cadastre-se', component: InserirClienteComponent,
  },
  {
    path: 'authentication', component: WebLoginComponent,
  },
  {
    path: 'dashboard', component: DashboardViewComponent, canActivate: [AuthenticationService],
    children:
      [
        {
          path: 'minha-conta', component: MinhaContaViewComponent,
          children: [
            {path: '', component: VisualizarMinhaContaComponent},
            {path: 'alterar', component: AlterarMinhaContaComponent},
            {path: 'minhas-estatisticas', component: MinhasEstatisticasComponent}
          ]
        },
        {
          path: 'atendentes', component: AtendenteViewComponent,
          children: [
            {path: '', component: ConsultarAtendentesComponent},
            {path: 'inserir', component: InserirAtendenteComponent},
            {path: ':id/alterar', component: AlterarAtendenteComponent},
            {path: ':id', component: VisualizarAtendenteComponent},
            {path: ':id/estatisticas', component: EstatisticasAtendenteComponent}
          ]
        },
        {
          path: 'unidades', component: UnidadeViewComponent,
          children: [
            {path: '', component: ConsultarUnidadesComponent},
            {path: 'inserir', component: InserirUnidadeComponent},
            {path: ':id/alterar', component: AlterarUnidadeComponent},
            {path: ':id', component: VisualizarUnidadeComponent},
            {path: ':id/estatisticas', component: EstatisticasUnidadeComponent}
          ]
        },
        {
          path: 'meus-melhores-atendentes', component: AtendenteRankingViewComponent,
          children: [
            {
              path: '', component: AtendenteRankingComponent
            },
            {
              path: ':id', component: EstatisticasAtendenteComponent
            }
          ]
        },
        {
          path: 'minhas-melhores-unidades', component: UnidadeRankingViewComponent,
          children: [
            {
              path: '', component: UnidadeRankingComponent
            },
            {
              path: ':id', component: EstatisticasUnidadeComponent
            }
          ]
        }
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
export class WebRoutingModule {
}
