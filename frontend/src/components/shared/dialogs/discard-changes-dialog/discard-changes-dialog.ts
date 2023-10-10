import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { TranslateModule } from '@ngx-translate/core';

import { AngularMaterialModule } from '@app/scripts/modules/angular-material.module';

@Component({
  selector: 'app-discard-changes-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule, AngularMaterialModule, ReactiveFormsModule, FormsModule],
  templateUrl: './discard-changes-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscardChangesDialogComponent {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string, action: string },
  ) { }
}
