import { Routes } from '@angular/router';

import { LoginComponent } from './../../user/login/login.component';
import { HomeComponent } from '../../home/home.component';
import { UserComponent } from '../../user/profile/user.component';
import { CreateClienteComponent } from 'app/administrador/create-cliente/create-cliente.component';

export const AdminLayoutRoutes: Routes = [
    { path: '',               component: HomeComponent },
    { path: 'user',           component: UserComponent },
    // { path: 'login',          component: LoginComponent },
    { path: 'edit',           component: CreateClienteComponent},
    { path: 'edit/:id',       component: CreateClienteComponent}

];
