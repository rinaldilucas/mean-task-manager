import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    constructor(private translateService: TranslateService) {
        const browserLang = this.translateService.getBrowserLang();
        this.translateService.addLangs(['en', 'pt-br']);
        this.translateService.setDefaultLang('pt-br');
        this.translateService.use(browserLang.match(/en|pt-br/) ? browserLang : 'pt-br');
    }
}
