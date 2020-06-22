import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
// import * as Swal from 'sweetalert2'


import { MiddleMongoService } from 'app/services/http/middle-mongo.service';

const Swal = require('sweetalert2');

@Component({
  selector: 'app-secured-touch',
  templateUrl: './secured-touch.component.html',
  styleUrls: ['./secured-touch.component.css']
})
export class SecuredTouchComponent implements OnInit {

  filtersLoaded: Promise<boolean>;
  isActiveValue = false;
  progreso = 0;

  constructor(private middle: MiddleMongoService, private router: Router) { }

  ngOnInit(): void {
    this.getDBValues();
    this.filtersLoaded = Promise.resolve(true);
  }

  activaswal() {
    Swal.fire('Any fool can use a computer');

  }
  async getDBValues () {
    const objectReturn = await this.middle.getSTValues();
    if (objectReturn['error']) {
      console.log(objectReturn);
      this.router.navigate(['/dashboard']);
    } else {
      this.isActiveValue = objectReturn['status'];
      this.progreso = objectReturn['valor'];
    }
  }

  toogleCheckbox(event: any) {
    console.log('check = ' , event.target.name, event.target.value, event.target.checked);
    this.isActiveValue = event.target.checked;
  }

  async guardar() {
    console.log('voy a guardar');
    const objectResponse = await this.middle.updateSTValues({
      value: this.progreso,
      active: this.isActiveValue
    });
    if (objectResponse === 'OK') {
      Swal.fire({
        icon: 'success',
        title: 'Valores Actualizados',
        // text: 'Something went wrong!',
      });
      this.router.navigate(['/dashboard']);
    } else {
      console.log(objectResponse);
      Swal.fire({
        icon: 'error',
        title: 'Ocurrio un error',
        text: JSON.stringify(objectResponse),
      });
    }

  }

  onChangeValue(newValue: number) {
    const elementHTML: any = document.getElementsByName('progreso')[0];
    if (newValue > 1000) {
      this.progreso = 1000;
    } else if (newValue < 0) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }
    elementHTML.value = Number(this.progreso);
  }

  cambiaValor(valor: number) {
    this.progreso += valor;
    if (this.progreso > 1000) {
      this.progreso = 1000;
    } else if (this.progreso < 0) {
      this.progreso = 0;
    }
    console.log(this.progreso);
  }

}
