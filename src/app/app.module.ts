import { LoginGuard } from './services/guards/login.guard';
import { AdministradorModule } from './administrador/administrador.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { MatFormFieldModule } from '@angular/material';
import { MatTableModule } from '@angular/material';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FooterModule } from './shared/footer/footer.module';
import { SidebarModule } from './sidebar/sidebar.module';

import { AppComponent } from './app.component';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './user/login/login.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NavbarModule,
    FooterModule,
    SidebarModule,
    AppRoutingModule,
    AmplifyAngularModule,
    BrowserModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    AdministradorModule,
    NgbModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent
  ],
  providers: [AmplifyService,
    LoginGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
