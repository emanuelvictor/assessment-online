import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from '@src/mobile/application/module/routing/routes/mobile.routes';

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class MobileRoutingModule { }
