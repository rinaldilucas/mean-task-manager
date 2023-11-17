import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { SharedService } from '@app/scripts/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomepageComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.sharedService.handleTitle(this.translate.instant('title.home'));
  }
}
