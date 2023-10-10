import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { SharedService } from '@app/scripts/services/shared.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomepageComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.sharedService.handleTitle(this.translate.instant('title.home'));
  }
}
