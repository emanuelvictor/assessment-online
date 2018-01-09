import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "../../web/domain/presentation/login/login.component";


const routes: Routes = [
  {path: '', redirectTo: 'entrada', pathMatch: 'full'},
  {
    path: 'authentication', component: LoginComponent,
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
export class MobileRoutingModule {
}