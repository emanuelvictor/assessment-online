import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import 'hammerjs';
import {WebModule} from '@src/web/application/presentation/web.module';
import {environment} from '@src/environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(WebModule).catch(err => console.log(err));
