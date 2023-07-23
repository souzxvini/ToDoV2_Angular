import { LoginComponent } from './views/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginGuard } from './guards/login.guard';
import { HomeGuard } from './guards/home.guard';
import { RegisterComponent } from './views/register/register.component';
import { RegisterGuard } from './guards/register.guard';
import { HeaderComponent } from './componentes/header/header.component';
import { ErrorComponent } from './views/error/error.component';

const routes: Routes = [

  {
    path:'',
    component: HeaderComponent,
    canActivate: [HomeGuard],
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'category', loadChildren: () => import('./views/category/category.module').then(m => m.CategoryModule) },
      { path: 'notifications', loadChildren: () => import('./views/notifications/notifications.module').then(m => m.NotificationsModule) }
    ]
  },
  {
    path:'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path:'register',
    component: RegisterComponent,
    canActivate: [RegisterGuard]
  },
  {
    path:'**',
    redirectTo: '404'
  },
  {
    path:'404',
    pathMatch: 'full',
    component: ErrorComponent,
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
