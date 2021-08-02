import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {
  public isDialogOpen: Boolean = false;

  constructor(public dialog: MatDialog) { }

  openDialog(message: string): any {
      if (this.isDialogOpen) {
          return;
      }

      this.isDialogOpen = true;

      const dialogRef = this.dialog.open(ErrorDialogComponent, {
          width: '350px',
          height: '120px',
          data: message
      });

      dialogRef.afterClosed().subscribe(() => {
          this.isDialogOpen = false;
      });
  }
}
