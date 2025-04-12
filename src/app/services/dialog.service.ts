import { Injectable } from '@angular/core';
//---------------------------------------------
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { IConfirmDialogData } from '../interfaces/i-confirm-dialog-data';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  confirmDialog(data: IConfirmDialogData): Observable<boolean> {
    return this.dialog.open(ConfirmDialogComponent, {
      data,
      width: '400px',
      disableClose: true,
      enterAnimationDuration:1000,
      exitAnimationDuration:1
    }).afterClosed();
  }
}
