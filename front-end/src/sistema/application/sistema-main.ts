import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import 'hammerjs';
import {SistemaModule} from '@src/sistema/application/presentation/sistema.module';
import {environment} from '@src/environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(SistemaModule).catch(err => console.log(err));
