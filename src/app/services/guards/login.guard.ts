import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { CognitoService } from 'app/services/aws/cognito.service';

@Injectable(
  //   {
  //   providedIn: 'root'
  // }
)
export class LoginGuard implements CanActivate {

  constructor(private usuario: CognitoService, private router: Router) { }

  async canActivate() {
    console.log('pase por el login guard');
    const result = await this.usuario.isLogguedIn();
    console.log('result: ', result);
    // TODO crear la variable en session y validar aqui
    if (result) {
      if (sessionStorage.getItem('jsonLogin')) {
        const jsonInicio = JSON.parse(sessionStorage.getItem('jsonLogin'));
        const tiempo = (new Date().getTime() - new Date (jsonInicio.horaInicio).getTime()) / 60000;
        console.log(tiempo);
        if (tiempo > 120 ) {
          this.usuario.signOut();
          this.router.navigate(['/login']);
          sessionStorage.clear();
          return false;
        }
      } else {
        this.usuario.signOut();
        sessionStorage.clear();
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    } else {
      sessionStorage.clear();
      this.router.navigate(['/login']);
      return false;
    }
  }

}
