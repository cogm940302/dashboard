import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CreateClienteComponent } from './create-cliente/create-cliente.component';
import { AdministradorRoutes } from './administrador.routing';




@NgModule({
  declarations: [CreateClienteComponent],
  imports: [
    CommonModule,
    NgModule ,
    RouterModule.forChild(AdministradorRoutes),
  ],
  exports: [
    CreateClienteComponent
  ]
})
export class AdministradorModule { }
