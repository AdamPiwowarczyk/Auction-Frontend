import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Credentials } from '../../model/credentials'
import { RegistrationDialogComponent } from '../registration-dialog/registration-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: Credentials;

  constructor(private authService: AuthService, private router: Router, public dialog: MatDialog) {
    this.credentials = {
      username:"user1", 
      password: "test"
    };
   }

  login(): void {
    this.authService.login(this.credentials).subscribe(
      next => {
        console.log(next)
        this.router.navigate(['/subjects']);
      },
      error => console.log(error))
  }

  logout(): void {
    // this.credentials.password = "";
    localStorage.removeItem('token');
  }

  // getRoles(): void {
  //   this.authService.getRoles().subscribe(
  //     response => console.log(response),
  //     error => console.log(error));
  // }

  openRegistrationDialog(): void {
    const dialogRef = this.dialog.open(RegistrationDialogComponent, {
      width: '300px',
      panelClass: 'registration-dialog-container',
      data: this.credentials 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.credentials = result;
      }
    });
  }

}
