import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { routes } from '@src/mobile/application/module/routing/routes/mobile.routes';

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes, {useHash: true})],
  exports: [NativeScriptRouterModule]
})
export class MobileRoutingModule { }
