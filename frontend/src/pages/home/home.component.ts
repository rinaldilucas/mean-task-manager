import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomepageComponent implements OnInit {
  title!: string;

  constructor(private titleService: Title, private translate: TranslateService) { }

  ngOnInit(): void {
    this.title = this.translate.instant('title.home');
    this.titleService.setTitle(`${this.title} — Mean Stack Template`);
  }
}
