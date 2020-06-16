import { CognitoService } from 'app/services/aws/cognito.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Clientes',  icon: 'pe-7s-graph', class: '' },
    { path: '/dashboard/edit', title: 'Nuevo Cliente',  icon: 'pe-7s-user', class: '' },
    // { path: '/dashboard/table', title: 'Table List',  icon:'pe-7s-note2', class: '' },
    // { path: '/typography', title: 'Typography',  icon:'pe-7s-news-paper', class: '' },
    // { path: '/dashboard/icons', title: 'Icons',  icon:'pe-7s-science', class: '' },
    // { path: '/maps', title: 'Maps',  icon:'pe-7s-map-marker', class: '' },
    // { path: '/notifications', title: 'Notifications',  icon:'pe-7s-bell', class: '' },
    // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'pe-7s-rocket', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(private cognitoService: CognitoService, public router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  salir() {
    console.log('voy a cerrar');
    this.cognitoService.signOut();
    this.router.navigate(['/login']);
  }
}
