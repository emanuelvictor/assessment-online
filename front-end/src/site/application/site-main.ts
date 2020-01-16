import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';

import {SiteModule} from './presentation/site.module';

import 'hammerjs';
import {environment} from '@src/environments/environment';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(SiteModule)
    .catch(err => console.log(err));
