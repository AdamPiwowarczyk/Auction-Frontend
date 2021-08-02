import { Component, Inject, Renderer2 } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css']
})
export class SnackBarComponent {
  message: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string,
              private snackRef: MatSnackBarRef<SnackBarComponent>,
              private ren: Renderer2) {
    this.message = `Kupiono przedmiot: ${this.data}`
    setTimeout(()=>{
      let snackEl = document.getElementsByClassName('mat-snack-bar-container').item(0);
      ren.listen(snackEl, 'click', () => this.dismiss())
    })
  }

  private dismiss(): void {
    this.snackRef.dismiss();
  }
}
