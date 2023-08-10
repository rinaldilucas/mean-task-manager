import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from '@app/environments/environment';
import { AppModule } from '@app/scripts/modules/app.module';

if (environment.production) { enableProdMode(); }
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
