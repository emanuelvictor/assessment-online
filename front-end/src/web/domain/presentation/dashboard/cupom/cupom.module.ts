import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {VisualizarCupomComponent} from "./visualizar-cupom/visualizar-cupom.component";
import {AlterarCupomComponent} from "./alterar-cupom/alterar-cupom.component";
import {ConsultarCuponsComponent} from "./consultar-cupons/consultar-cupons.component";
import {InserirCupomComponent} from "./inserir-cupom/inserir-cupom.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CupomViewComponent} from "./cupom-view.component";
import {CupomFormComponent} from "./inserir-cupom/cupom-form/cupom-form.component";
import {DashboardSharedModule} from "../dashboard.shared.module";


const routes: Routes = [
  {path: '', component: ConsultarCuponsComponent},
  {path: 'inserir', component: InserirCupomComponent},
  {path: ':id/alterar', component: AlterarCupomComponent},
  {path: ':id', component: VisualizarCupomComponent}
];

@NgModule({
  declarations: [
    // Cupons
    CupomViewComponent,
    ConsultarCuponsComponent,
    VisualizarCupomComponent,
    AlterarCupomComponent,
    InserirCupomComponent,
    CupomFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardSharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [],
  entryComponents: [],
})
export class CupomModule {
}
