import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.html'
})
export class ConfirmationDialogComponent {
    constructor (
        public dialog: MatDialog, //
        @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string }
    ) {}
}