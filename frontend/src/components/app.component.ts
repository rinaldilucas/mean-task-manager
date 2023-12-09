import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@app/scripts/services/auth.service';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
  ) {
    const browserLang = this.translate.getBrowserLang();
    this.translate.addLangs(['en-US', 'pt-BR']);
    this.translate.setDefaultLang('en-US');

    let language = localStorage.getItem('language') as string;

    if (language) {
      this.translate.use(language);
    } else {
      language = browserLang.match(/en-US/i) ? browserLang : 'pt-BR';
      this.translate.use(language);
      localStorage.setItem('language', language);
    }

    window.addEventListener('storage', this.storageEventListener.bind(this));
  }

  storageEventListener(event: StorageEvent): void {
    if (event.key === 'access' && !event.newValue) this.authService.logoutAsync();
  }
}
