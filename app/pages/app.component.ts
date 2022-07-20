import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    constructor (private translateService: TranslateService) {
        const browserLang = this.translateService.getBrowserLang();
        this.translateService.addLangs(['en-US', 'pt-BR']);
        this.translateService.setDefaultLang('pt-BR');

        const language = localStorage.getItem('language') as string;

        if (language) this.translateService.use(language);
        else this.translateService.use(browserLang.match(/en/i) ? browserLang : 'pt-BR');
    }
}
