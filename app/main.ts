import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '@scripts/modules/app.module';

enableProdMode();
platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
