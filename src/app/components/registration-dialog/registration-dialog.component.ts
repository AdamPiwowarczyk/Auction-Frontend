import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Credentials } from 'src/app/model/credentials';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registration-dialog',
  templateUrl: './registration-dialog.component.html',
  styleUrls: ['./registration-dialog.component.css']
})
export class RegistrationDialogComponent {
  credentials: Credentials;
  passwordConfirm = "";
  pristine = true;

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<RegistrationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Credentials) {
      this.credentials = Object.assign({}, data);
    }

  register(): void {
    this.authService.register(this.credentials).subscribe(
      response => {
        console.log(response);
        this.dialogRef.close(this.credentials);
      },
      error => console.log(error));
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
