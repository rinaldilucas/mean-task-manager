import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomepageComponent implements OnInit {
    title!: string;

    constructor (private titleService: Title, private translateService: TranslateService) {}

    ngOnInit (): void {
        this.translateService.get('title.home').pipe(take(1)).subscribe((text: string) => {
            this.title = text;
            this.titleService.setTitle(`${this.title} — Mean Stack Template`);
        });
    }
}
