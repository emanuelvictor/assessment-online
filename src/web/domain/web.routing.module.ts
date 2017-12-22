import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardViewComponent} from "./presentation/dashboard/dashboard-view.component";
import {VisualizarMinhaContaComponent} from "./presentation/dashboard/minha-conta/visualizar-minha-conta/visualizar-minha-conta.component";
import {AlterarMinhaContaComponent} from "./presentation/dashboard/minha-conta/alterar-minha-conta/alterar-minha-conta.component";
import {ConsultarUsuariosComponent} from "./presentation/dashboard/usuario/consultar-usuarios/consultar-usuarios.component";
import {InserirUsuarioComponent} from "./presentation/dashboard/usuario/inserir-usuario/inserir-usuario.component";
import {MinhaContaViewComponent} from "./presentation/dashboard/minha-conta/minha-conta-view.component";
import {UsuarioViewComponent} from "./presentation/dashboard/usuario/usuario-view.component";
import {AlterarUsuarioComponent} from "./presentation/dashboard/usuario/alterar-usuario/alterar-usuario.component";
import {VisualizarUsuarioComponent} from "./presentation/dashboard/usuario/visualizar-usuario/visualizar-usuario.component";
import {ConsultarPontosColetaComponent} from "./presentation/dashboard/ponto-coleta/consultar-pontos-coleta/consultar-pontos-coleta.component";
import {PontoColetaViewComponent} from "./presentation/dashboard/ponto-coleta/ponto-coleta-view.component";
import {InserirPontoColetaComponent} from "./presentation/dashboard/ponto-coleta/inserir-ponto-coleta/inserir-ponto-coleta.component";
import {AlterarPontoColetaComponent} from "./presentation/dashboard/ponto-coleta/alterar-ponto-coleta/alterar-ponto-coleta.component";
import {VisualizarPontoColetaComponent} from "./presentation/dashboard/ponto-coleta/visualizar-ponto-coleta/visualizar-ponto-coleta.component";
import {FornecedorViewComponent} from "./presentation/dashboard/fornecedor/fornecedor-view.component";
import {ConsultarFornecedoresComponent} from "./presentation/dashboard/fornecedor/consultar-fornecedores/consultar-fornecedores.component";
import {InserirFornecedorComponent} from "./presentation/dashboard/fornecedor/inserir-fornecedor/inserir-fornecedor.component";
import {AlterarFornecedorComponent} from "./presentation/dashboard/fornecedor/alterar-fornecedor/alterar-fornecedor.component";
import {EntradaViewComponent} from "./presentation/dashboard/entrada/entrada-view.component";
import {InserirEntradaComponent} from "./presentation/dashboard/entrada/inserir-entrada/inserir-entrada.component";
import {ConsultarEntradasComponent} from "./presentation/dashboard/entrada/consultar-entradas/consultar-entradas.component";
import {VisualizarEntradaComponent} from "./presentation/dashboard/entrada/visualizar-entrada/visualizar-entrada.component";
import {FichaViewComponent} from "./presentation/dashboard/ficha/ficha-view.component";
import {ConsultarFichasComponent} from "./presentation/dashboard/ficha/consultar-fichas/consultar-fichas.component";
import {InserirFichaComponent} from "./presentation/dashboard/ficha/inserir-ficha/inserir-ficha.component";
import {VisualizarFichaComponent} from "./presentation/dashboard/ficha/visualizar-ficha/visualizar-ficha.component";
import {AlterarEntradaComponent} from "./presentation/dashboard/entrada/alterar-entrada/alterar-entrada.component";
import {AlterarFichaComponent} from "./presentation/dashboard/ficha/alterar-ficha/alterar-ficha.component";
import {LoginComponent} from "./presentation/login/login.component";
import {AuthGuard} from "./service/auth-guard.service";


const routes: Routes = [

  {path: '', redirectTo: 'dashboard/minha-conta', pathMatch: 'full'},
  {
    path: 'authentication', component: LoginComponent,
  },
  {
    path: 'dashboard', component: DashboardViewComponent, //canActivate: [AuthGuard],
    children: [
      {
        path: 'minha-conta', component: MinhaContaViewComponent,
        children: [
          {path: '', component: VisualizarMinhaContaComponent},
          {path: 'alterar', component: AlterarMinhaContaComponent}
        ]
      },
      {
        path: 'usuarios', component: UsuarioViewComponent,
        children: [
          {path: '', component: ConsultarUsuariosComponent},
          {path: 'inserir', component: InserirUsuarioComponent},
          {path: ':id/alterar', component: AlterarUsuarioComponent},
          {path: ':id', component: VisualizarUsuarioComponent}
        ]
      },
      {
        path: 'fornecedores', component: FornecedorViewComponent,
        children: [
          {path: '', component: ConsultarFornecedoresComponent},
          {path: 'inserir', component: InserirFornecedorComponent},
          {path: ':id/alterar', component: AlterarFornecedorComponent},
          {path: ':id', component: VisualizarUsuarioComponent}
        ]
      },
      {
        path: 'pontos-coleta', component: PontoColetaViewComponent,
        children: [
          {path: '', component: ConsultarPontosColetaComponent},
          {path: 'inserir', component: InserirPontoColetaComponent},
          {path: ':id/alterar', component: AlterarPontoColetaComponent},
          {path: ':id', component: VisualizarPontoColetaComponent},
        ]
      },
      {
        path: 'entradas', component: EntradaViewComponent,
        children: [
          {path: '', component: ConsultarEntradasComponent},
          {path: 'inserir', component: InserirEntradaComponent},
          {path: ':id/alterar', component: AlterarEntradaComponent},
          {path: ':id', component: VisualizarEntradaComponent},
        ]
      },
      {
        path: 'fichas', component: FichaViewComponent,
        children: [
          {path: '', component: ConsultarFichasComponent},
          {path: 'inserir', component: InserirFichaComponent},
          {path: ':id', component: VisualizarFichaComponent},
          {path: ':id/alterar', component: AlterarFichaComponent}
        ]
      }]
  },
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