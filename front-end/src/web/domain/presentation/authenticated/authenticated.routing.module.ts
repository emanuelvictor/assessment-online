import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ClienteViewComponent} from "./cliente/cleinte-view.component";
import {ConsultarClientesComponent} from "./cliente/consultar-clientes/consultar-clientes.component";
import {VisualizarClienteComponent} from "./cliente/visualizar-cliente/visualizar-cliente.component";
import {MinhaContaViewComponent} from "./minha-conta/minha-conta-view.component";
import {VisualizarMinhaContaComponent} from "./minha-conta/visualizar-minha-conta/visualizar-minha-conta.component";
import {AlterarMinhaContaComponent} from "./minha-conta/alterar-minha-conta/alterar-minha-conta.component";
import {MinhasEstatisticasComponent} from "./minha-conta/visualizar-minha-conta/estatisticas/minhas-estatisticas.component";
import {VisualizarAtendenteComponent} from "./atendente/visualizar-atendente/visualizar-atendente.component";
import {EstatisticasAtendenteComponent} from "./atendente/visualizar-atendente/estatisticas/estatisticas-atendente.component";
import {AlterarAtendenteComponent} from "./atendente/alterar-atendente/alterar-atendente.component";
import {InserirAtendenteComponent} from "./atendente/inserir-atendente/inserir-atendente.component";
import {ConsultarAtendentesComponent} from "./atendente/consultar-atendentes/consultar-atendentes.component";
import {AtendenteViewComponent} from "./atendente/atendente-view.component";
import {InserirUnidadeComponent} from "./unidade/inserir-unidade/inserir-unidade.component";
import {ConsultarUnidadesComponent} from "./unidade/consultar-unidades/consultar-unidades.component";
import {UnidadeViewComponent} from "./unidade/unidade-view.component";
import {ConsultarUsuariosComponent} from "./atendente/consultar-atendentes/consultar-usuarios.component";
import {VisualizarAvaliacaoComponent} from "./avaliacao/visualizar-avaliacao/visualizar-avaliacao.component";
import {ConfiguracaoComponent} from "./configuracao/configuracao.component";
import {ConsultarAvaliacoesComponent} from "./avaliacao/consultar-avaliacoes/consultar-avaliacoes.component";
import {AvaliacaoViewComponent} from "./avaliacao/avaliacao-view.component";
import {AlterarDispositivoComponent} from "./dispositivo/alterar-dispositivo/alterar-dispositivo.component";
import {VisualizarDispositivoComponent} from "./dispositivo/visualizar-dispositivo/visualizar-dispositivo.component";
import {InserirDispositivoComponent} from "./dispositivo/inserir-dispositivo/inserir-dispositivo.component";
import {ConsultarDispositivosComponent} from "./dispositivo/consultar-dispositivos/consultar-dispositivos.component";
import {DispositivoViewComponent} from "./dispositivo/dispositivo-view.component";
import {AlterarTipoAvaliacaoComponent} from "./tipo-avaliacao/alterar-tipo-avaliacao/alterar-tipo-avaliacao.component";
import {VisualizarTipoAvaliacaoComponent} from "./tipo-avaliacao/visualizar-tipo-avaliacao/visualizar-tipo-avaliacao.component";
import {InserirTipoAvaliacaoComponent} from "./tipo-avaliacao/inserir-tipo-avaliacao/inserir-tipo-avaliacao.component";
import {ConsultarTiposAvaliacoesComponent} from "./tipo-avaliacao/consultar-tipos-avaliacoes/consultar-tipos-avaliacoes.component";
import {TipoAvaliacaoViewComponent} from "./tipo-avaliacao/tipo-avaliacao-view.component";
import {EstatisticasUnidadeComponent} from "./unidade/visualizar-unidade/estatisticas/estatisticas-unidade.component";
import {VisualizarUnidadeComponent} from "./unidade/visualizar-unidade/visualizar-unidade.component";
import {AlterarUnidadeComponent} from "./unidade/alterar-unidade/alterar-unidade.component";
import {AssinaturaComponent} from "./assinatura/assinatura.component";
import {FaturaViewComponent} from "./fatura/fatura-view.component";
import {ConsultarFaturasComponent} from "./fatura/consultar-faturas/consultar-faturas.component";
import {VisualizarFaturaComponent} from "./fatura/visualizar-fatura/visualizar-fatura.component";
import {AuthenticatedViewComponent} from "./authenticated-view.component";


const routes: Routes = [
  {
    path: '', component: AuthenticatedViewComponent,
    children: [
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
        path: 'dispositivos', component: DispositivoViewComponent,
        children: [
          {path: '', component: ConsultarDispositivosComponent},
          {path: 'inserir', component: InserirDispositivoComponent},
          {path: ':numeroLicenca', component: VisualizarDispositivoComponent},
          {path: ':numeroLicenca/alterar', component: AlterarDispositivoComponent}
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
      },
      {
        path: 'assinatura', component: AssinaturaComponent,
      },
      {
        path: 'faturas', component: FaturaViewComponent,
        children: [
          {path: '', component: ConsultarFaturasComponent},
          {path: ':id', component: VisualizarFaturaComponent}
        ]
      },
      {
        path: 'cupons', loadChildren: '../../../domain/presentation/authenticated/cupom/cupom.module#CupomModule'
      }
    ]
  }
];

/**
 *
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AuthenticatedRoutingModule {
}
