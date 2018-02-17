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
import {ConsultarUnidadesComponent} from './presentation/dashboard/unidade/consultar-unidades/consultar-unidades.component';
import {VisualizarUnidadeComponent} from './presentation/dashboard/unidade/visualizar-unidade/visualizar-unidade.component';
import {AuthenticationService} from './service/authentication.service';


const routes: Routes = [
  {
    path: '', redirectTo: 'dashboard/minha-conta', pathMatch: 'full'
  },
  {
    path: 'authentication', component: LoginComponent,
  },
  {
    path: 'dashboard', component: DashboardViewComponent, canActivate: [AuthenticationService],
    children:
      [
        {
          path: 'minha-conta', component: MinhaContaViewComponent,
          children: [
            {path: '', component: VisualizarMinhaContaComponent},
            {path: 'alterar', component: AlterarMinhaContaComponent}
          ]
        },
        {
          path: 'atendentes', component: AtendenteViewComponent,
          children: [
            {path: '', component: ConsultarAtendentesComponent},
            {path: 'inserir', component: InserirAtendenteComponent},
            {path: ':key/alterar', component: AlterarAtendenteComponent},
            {path: ':key', component: VisualizarAtendenteComponent}
          ]
        },
        {
          path: 'unidades', component: UnidadeViewComponent,
          children: [
            {path: '', component: ConsultarUnidadesComponent},
            {path: 'inserir', component: InserirUnidadeComponent},
            {path: ':key/alterar', component: AlterarUnidadeComponent},
            {path: ':key', component: VisualizarUnidadeComponent},
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