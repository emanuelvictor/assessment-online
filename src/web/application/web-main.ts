import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {enableProdMode} from "@angular/core";
import 'hammerjs';
import {environment} from "../../environments/environment";
import {WebModule} from "../domain/web.module";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(WebModule).catch(err => console.log(err));
