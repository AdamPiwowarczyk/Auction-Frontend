import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SubjectComponent } from './components/subject/subject.component';
import { SubjectDetailsComponent } from './components/subject-details/subject-details.component';
import { CategoryComponent } from './components/category/category.component';
import { BidComponent } from './components/bid/bid.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'subjects',
    component: SubjectComponent,
    canActivate: [ AuthGuardService ] 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
