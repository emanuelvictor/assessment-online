import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardViewComponent} from './presentation/dashboard/dashboard-view.component';
import {VisualizarMinhaContaComponent} from './presentation/dashboard/minha-conta/visualizar-minha-conta/visualizar-minha-conta.component';
import {AlterarMinhaContaComponent} from './presentation/dashboard/minha-conta/alterar-minha-conta/alterar-minha-conta.component';
import {MinhaContaViewComponent} from './presentation/dashboard/minha-conta/minha-conta-view.component';
import {VisualizarAtendenteComponent} from './presentation/dashboard/atendente/visualizar-atendente/visualizar-atendente.component';
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
import {MinhasEstatisticasComponent} from './presentation/dashboard/minha-conta/visualizar-minha-conta/estatisticas/minhas-estatisticas.component';
import {InserirClienteComponent} from './presentation/dashboard/cliente/inserir-cliente/inserir-cliente.component';
import {WebLoginComponent} from './presentation/login/web-login/web-login.component';
import {ConfiguracaoComponent} from "./presentation/dashboard/configuracao/configuracao.component";
import {AvaliacaoViewComponent} from "./presentation/dashboard/avaliacao/avaliacao-view.component";
import {ConsultarAvaliacoesComponent} from "./presentation/dashboard/avaliacao/consultar-avaliacoes/consultar-avaliacoes.component";
import {VisualizarAvaliacaoComponent} from "./presentation/dashboard/avaliacao/visualizar-avaliacao/visualizar-avaliacao.component";
import {TipoAvaliacaoViewComponent} from "./presentation/dashboard/tipo-avaliacao/tipo-avaliacao-view.component";
import {ConsultarTiposAvaliacoesComponent} from "./presentation/dashboard/tipo-avaliacao/consultar-tipos-avaliacoes/consultar-tipos-avaliacoes.component";
import {InserirTipoAvaliacaoComponent} from "./presentation/dashboard/tipo-avaliacao/inserir-tipo-avaliacao/inserir-tipo-avaliacao.component";
import {AlterarTipoAvaliacaoComponent} from "./presentation/dashboard/tipo-avaliacao/alterar-tipo-avaliacao/alterar-tipo-avaliacao.component";
import {VisualizarTipoAvaliacaoComponent} from "./presentation/dashboard/tipo-avaliacao/visualizar-tipo-avaliacao/visualizar-tipo-avaliacao.component";
import {VisualizarClienteComponent} from "./presentation/dashboard/cliente/visualizar-cliente/visualizar-cliente.component";
import {ConsultarClientesComponent} from "./presentation/dashboard/cliente/consultar-clientes/consultar-clientes.component";
import {ClienteViewComponent} from "./presentation/dashboard/cliente/cleinte-view.component";
import {ConsultarUsuariosComponent} from "./presentation/dashboard/atendente/consultar-atendentes/consultar-usuarios.component";
import {ErrorComponent} from "../../mobile/domain/presentation/error/error.component";
import {QuestionarioViewComponent} from "./presentation/dashboard/questionario/questionario-view.component";
import {ConsultarQuestionariosComponent} from "./presentation/dashboard/questionario/consultar-questionarios/consultar-questionarios.component";
import {InserirQuestionarioComponent} from "./presentation/dashboard/questionario/inserir-questionario/inserir-questionario.component";
import {VisualizarQuestionarioComponent} from "./presentation/dashboard/questionario/visualizar-questionario/visualizar-questionario.component";
import {AlterarQuestionarioComponent} from "./presentation/dashboard/questionario/alterar-questionario/alterar-questionario.component";


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
          path: 'clientes', component: ClienteViewComponent,
          children: [
            {path: '', component: ConsultarClientesComponent},
            {path: ':id', component: VisualizarClienteComponent}
          ]
        },
        {
          path: 'minha-conta', component: MinhaContaViewComponent,
          children: [
            {path: '', component: VisualizarMinhaContaComponent},
            {path: 'alterar', component: AlterarMinhaContaComponent},
            {path: 'minhas-estatisticas', component: MinhasEstatisticasComponent}
          ]
        },
        {
          path: 'avaliaveis', component: AtendenteViewComponent,
          children: [
            {path: '', component: ConsultarAtendentesComponent},
            {path: 'inserir', component: InserirAtendenteComponent},
            {path: ':id/alterar', component: AlterarAtendenteComponent},
            {path: ':id', component: VisualizarAtendenteComponent},
            {path: ':id/estatisticas', component: EstatisticasAtendenteComponent}
          ]
        },
        {
          path: 'usuarios', component: AtendenteViewComponent,
          children: [
            {path: '', component: ConsultarUsuariosComponent},
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
          path: 'avaliacoes', component: TipoAvaliacaoViewComponent,
          children: [
            {path: '', component: ConsultarTiposAvaliacoesComponent},
            {path: 'inserir', component: InserirTipoAvaliacaoComponent},
            {path: ':id', component: VisualizarTipoAvaliacaoComponent},
            {path: ':id/alterar', component: AlterarTipoAvaliacaoComponent}
          ]
        },
        {
          path: 'dispositivos', component: QuestionarioViewComponent,
          children: [
            {path: '', component: ConsultarQuestionariosComponent},
            {path: 'inserir', component: InserirQuestionarioComponent},
            {path: ':id', component: VisualizarQuestionarioComponent},
            {path: ':id/alterar', component: AlterarQuestionarioComponent}
          ]
        },
        {
          path: 'resultados', component: AvaliacaoViewComponent,
          children: [
            {path: '', component: ConsultarAvaliacoesComponent},
            {path: ':id', component: VisualizarAvaliacaoComponent}
          ]
        },
        {
          path: 'configuracoes', component: ConfiguracaoComponent,
        }
      ]
  },
  {
    path: 'error', component: ErrorComponent
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
