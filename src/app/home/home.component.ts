import { Component, OnInit, ViewChild } from '@angular/core';
// import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
// import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
// import * as Chartist from 'chartist';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

import { CognitoService } from 'app/services/aws/cognito.service';
import { MiddleMongoService } from './../services/http/middle-mongo.service';
import { Clientes } from 'app/model/Clientes';
import { isEmpty } from 'app/model/UtilValidator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'correo', 'ApiToken'];
  dataSource: any;
  expandedElement: Clientes | null;
  clientes: any;
  errorGenerico: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private middleMongo: MiddleMongoService, private cognito: CognitoService, public router: Router) {
}

createClient() {
  // this.router.navigate([RutasPrivadas.privateCreate]);
  // this.ngZone.run(() => { });

}
async ngOnInit() {
  // if (!sessionStorage.getItem('loginJson')) {
  //   this.userService.logout();
  //   this.router.navigate([RutasPublicas.login]);
  //   return;
  // }

  console.log('error generico: ' + this.errorGenerico);
  console.log('voy por los clientes');
  this.clientes = [];
  this.paginator._intl.itemsPerPageLabel = 'Resultados por pagina';
  this.dataSource = new MatTableDataSource<Clientes>(this.clientes);
  await this.readWSClient();
}

async creaClienteVirtual() {
  this.cognito.creaClient('');
}

async readWSClient() {
  // this.cognito.getCredentialsExample();
  // await this.cognito.creaLasCredenciales();
  console.log('si voy por los clientes');
  this.clientes = await this.middleMongo.getCustomers();
  // console.log(this.clientes);
  if (this.clientes && !isEmpty(this.clientes) ) {
    this.dataSource = new MatTableDataSource<Clientes>(this.clientes);
    this.dataSource.paginator = this.paginator;
  }
}

applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

async editClient(id: string, user: string, pwd: string) {
  console.log('voy a guardar los datos ' + id + ' ' + user + ' ' + pwd);
  // sessionStorage.setItem('tokenEdit', await this.tokenService.generaToken(user, pwd));
  this.router.navigate(['/dashboard/edit' + `/${id}`]);

}

}
