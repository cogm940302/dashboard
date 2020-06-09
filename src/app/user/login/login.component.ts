import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { CognitoService } from 'app/services/aws/cognito.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo = 'Ingresa tus datos';
  textUser: string;
  textPwd: string;
  newPass = false;
  newPassText: string;
  confirmNewPassText: string;
  error: string;

  constructor(public router: Router, private cognito: CognitoService) { }

  ngOnInit(): void {
  }

  async iniciar() {
    // this.router.navigate(['/dashboard/']);
    const resultado = await this.cognito.signIn(this.textUser, this.textPwd);
    this.error = '';
    console.log(resultado);
    if (resultado === '') {
      this.router.navigate(['/dashboard/']);
    } else if (resultado === 'NEW') {
      this.titulo = 'Cambia tu contraseña';
      this.newPass = true;
    } else {
      this.error = 'Usuario o contraseña incorrectos';
    }
  }

  async cambioDePassword() {
    if (this.newPassText !== this.confirmNewPassText) {
      this.error = 'Tus contraseñas deben ser iguales';
      return;
    }
    const resultado = await this.cognito.changePass(this.textUser, this.textPwd, this.newPassText);
    console.log(resultado);
    if (resultado === '') {
      this.router.navigate(['/dashboard/']);
    } else {
      this.resetValues('Ocurrio un error, favor de volver a intentar');
    }
  }

  resetValues(error: string) {
    this.titulo = 'Ingresa tus datos';
    this.textUser = '';
    this.textPwd = '';
    this.newPass = false;
    this.newPassText = '';
    this.confirmNewPassText = '';
    this.error = error;
  }
}
