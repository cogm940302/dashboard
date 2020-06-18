import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { LoginGuard } from './services/guards/login.guard';
import { LoginComponent } from './user/login/login.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';



const APP_ROUTES: Routes = [

  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  }, {
    path: 'login',
    component: LoginComponent,
  },

];

const secureHomeRoutes: Routes = [

  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  }, {
    path: 'dashboard',
    component: AdminLayoutComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: '',
        loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
      }]
  },

]



const routes: Routes = [
  {
    path: '',
    children: [
      ...APP_ROUTES,
      ...secureHomeRoutes,
      {
        path: '',
        component: LoginComponent
      }
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
