import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    const browserLang = this.translate.getBrowserLang();
    this.translate.addLangs(['en-US', 'pt-BR']);
    this.translate.setDefaultLang('pt-BR');

    const language = localStorage.getItem('language') as string;

    if (language) this.translate.use(language);
    else this.translate.use(browserLang.match(/en-US/i) ? browserLang : 'pt-BR');
  }
}