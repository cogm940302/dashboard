import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';

import { CreateClienteComponent } from './create-cliente/create-cliente.component';
import { AdministradorRoutes } from './administrador.routing';
import { from } from 'rxjs';
import { OfertasComponent } from './ofertas/ofertas.component';
import { OfertasNombreComponent } from './ofertas-nombre/ofertas-nombre.component';




@NgModule({
  declarations: [CreateClienteComponent, OfertasComponent, OfertasNombreComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(AdministradorRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule
  ],
  exports: [
    CreateClienteComponent
  ]
})
export class AdministradorModule { }
