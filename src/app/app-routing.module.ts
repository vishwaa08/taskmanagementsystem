import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegisterComponent } from './pages/user-register/user-register.component';
import { UserLoginComponent } from './pages/user-login/user-login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './services/guard/auth-guard.guard';
import { UserAuthGuard } from './services/guard/user-auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { AddTaskComponent } from './pages/add-task/add-task.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: UserRegisterComponent,canActivate: [AuthGuard] },
  { path: 'login', component: UserLoginComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [UserAuthGuard] },
  { path: "add-task", component: AddTaskComponent, canActivate: [UserAuthGuard] },
  { path: "update-task/:id", component: AddTaskComponent, canActivate: [UserAuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
