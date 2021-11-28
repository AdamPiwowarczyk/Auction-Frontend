import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { SubjectComponent } from './components/subject/subject.component';
import { BidComponent } from './components/bid/bid.component';
import { AppRoutingModule } from './app-routing.module';
import { SubjectDetailsComponent } from './components/subject-details/subject-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RegistrationDialogComponent } from './components/registration-dialog/registration-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CategoryNewComponent } from './components/category-new/category-new.component';
import { MatSelectModule } from '@angular/material/select';
import { SubjectCardComponent } from './components/subject-card/subject-card.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxMatDateFormats, NgxMatDatetimePickerModule, NgxMatTimepickerModule, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ErrorInterceptor } from './interceptors/error.interceptor'
import { HeaderInterceptor } from './interceptors/header.interceptor'

import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import localePl from '@angular/common/locales/pl';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
registerLocaleData(localePl);

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: "l, LTS"  
  },
  display: {
    dateInput: "DD.MM.YYYY, HH:mm",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SubjectComponent,
    BidComponent,
    SubjectDetailsComponent,
    RegistrationDialogComponent,
    CategoryNewComponent,
    SubjectCardComponent,
    SnackBarComponent,
    ErrorDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatSelectModule,
    TextFieldModule,
    MatGridListModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatDatepickerModule,
    NgxMatMomentModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "pl-PL"}, 
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
