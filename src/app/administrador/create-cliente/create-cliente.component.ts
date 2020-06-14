import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MiddleMongoService } from './../../services/http/middle-mongo.service';
import { Ofertas, Servicio, Clientes, Oferta } from 'app/model/Clientes';
import { OfertaService } from 'app/services/http/oferta.service';


@Component({
  selector: 'app-create-cliente',
  templateUrl: './create-cliente.component.html',
  styleUrls: ['./create-cliente.component.css']
})
export class CreateClienteComponent implements OnInit {

  // para las ofertas
  ofertasExistentes: Ofertas;
  servciosDeOfertasExistentes: Servicio[];
  ofertasN: Servicio[];
  abrir = false;

  // Clases
  cliente = new Clientes();
  ofertas: Ofertas;
  oferta: Oferta;
  ofertaAdd: Oferta;
  servicio: Servicio;
  ofertasArray: Oferta[];

  // Varibles
  agregar: boolean;
  id: string;
  submitted = false;
  isDup = false;
  botonValue = 'Guardar';
  index = 0;
  errorGenerico = '';

  daonPropiedades = [{ nombre: 'Selfie' },
  { nombre: 'Documento de Identidad' }, { nombre: 'Prueba de vida' }];

  //  myForm = MyFormClient;
  // Formulario de Clientes en el HTML
  public myForm = new FormGroup({
    nombre: new FormControl('', [ Validators.required]),
    correo: new FormControl('', [ Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    password: new FormControl(''),
    token: new FormControl(''),
    telefono: new FormControl('', [Validators.pattern('(([0-9]{10} ext [0-9]{1,4})|([0-9]{10}))')]),
    lisPos: new FormControl(''),
    lis: new FormControl(''),
    hrefDaon: new FormControl(''),
    nombreOferta: new FormControl(''),
    nombreOfertaAdd: new FormControl(''),
    selectname: new FormControl(''),
    btnagregar: new FormControl(''),
  });
  filtersLoaded: Promise<boolean>;
  public recepcionValidacionPropiedades: Servicio;


  constructor( public router: Router,
    private actRoute: ActivatedRoute, private client: MiddleMongoService,
    private ofertaService: OfertaService)  { }

  ngOnInit(): void {
    this.ofertas = new Ofertas();
    this.ofertas._id = undefined;
    this.oferta = new Oferta();
    this.servicio = new Servicio();
    this.ofertas.ofertas = [];
    this.cliente = new Clientes();

    // se recibe id cuando se va a actualizar el cliente
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.initOtherProperties();
    if (this.id !== undefined && this.id !== '') {
      this.agregar = false;
      this.botonValue = 'Actualizar';
      const tokenOauth = sessionStorage.getItem('tokenEdit');
      this.myForm.controls['nombre'].disable();
      // sessionStorage.removeItem('tokenEdit');
      const objectResponse = {};
      // const objectResponse = await this.client.getCustomer(this.id, tokenOauth);
      console.log(objectResponse);
      console.log(JSON.stringify(objectResponse));
      if (objectResponse['error']) {
        this.router.navigate(['/dashboard']);
        return;
      }
      Object.assign(this.cliente, objectResponse['response']);
      Object.assign(this.ofertas, objectResponse['responseOferta']);
      this.oferta = this.ofertas.ofertas[(this.ofertas.ofertas.length - 1)];
      this.filtersLoaded = Promise.resolve(true);

    } else {
      this.agregar = true;
      this.filtersLoaded = Promise.resolve(true);
    }
    this.sendOfer();
  }

  async sendOfer() {
    this.ofertasN = [];
    this.ofertasN[0] = new Servicio();
    this.ofertasN[0].nombre = 'Daon';
    this.ofertasN[0].props = ['Selfie', 'Documento', 'Prueva de vida'];
    this.ofertasN[1] = new Servicio();
    this.ofertasN[1].nombre = 'Validación Recepción';
    this.ofertasN[1].props = ['Correo Electrónico', 'SMS'];

    this.abrir = true;
  }

  async getUserAndPass() {
    // const datos = await (this.userService.onCreateNewUser(this.cliente.nombre));
    // this.cliente.ApiToken = datos['UserPoolClient']['ClientId'];
    // this.cliente.pass = datos['UserPoolClient']['ClientSecret'];
    // if (this.cliente.ApiToken === undefined || this.cliente.pass === undefined) {
    //   return false;
    // }
    // return true;
  }
  async guardar() {
    this.errorGenerico = '';

    this.isDup = false;
    this.submitted = true;
    this.cliente._id = this.id;
    this.cliente.nombre = (this.myForm.controls.nombre.value) === '' ? this.cliente.nombre : this.myForm.controls.nombre.value;
    this.cliente.correo = (this.myForm.controls.correo.value) === '' ? this.cliente.correo : this.myForm.controls.correo.value;
    this.myForm.patchValue({ correo: this.cliente.correo });
    this.cliente.telefono = (this.myForm.controls.telefono.value) === '' ? this.cliente.telefono : this.myForm.controls.telefono.value;
    this.cliente.listasBlancasPost = (this.myForm.controls.lisPos.value) === '' ? this.cliente.listasBlancasPost : this.myForm.controls.lisPos.value;
    this.cliente.hrefDaon = (this.myForm.controls.hrefDaon.value) === '' ? this.cliente.hrefDaon : this.myForm.controls.hrefDaon.value;
    this.cliente.listasBlancas = (this.myForm.controls.lis.value) === '' ? this.cliente.listasBlancas : this.myForm.controls.lis.value.split(",");

    if (this.myForm.invalid) {
      this.f.correo.updateValueAndValidity();
      // await this.spinner.hide();
      return;
    }
    console.log(this.cliente._id);
    if (this.cliente._id === undefined) {
    //   const resultCognito = await this.getUserAndPass();
    //   if (!resultCognito) {
    //     this.errorGenerico = 'Error, favor de volver a intentar';
    //   } else {
    //     this.errorGenerico = await this.client.createCustomer(this.cliente, this.ofertas);
    //   }
    }
    // else {
    //   this.errorGenerico = await this.client.updateCustomer(this.cliente, this.id, this.cliente._id, this.ofertas);
    // }
    if (this.errorGenerico === 'OK') {
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    } else {
      // await this.spinner.hide();
    }

  }


  regresar() {
    this.router.navigate(['/dashboard']);
  }

  recibeOferta(event) {
    console.log(event);
    this.ofertas = event;
  }

  get f() { return this.myForm.controls; }

  isDupicate(): ValidatorFn {
    return () => {
      if (this.isDup && this.submitted) {
        this.isDup = false;
        return { unique: true };
      } else {
        return null;
      }
    };
  }
  initOtherProperties() {
    this.recepcionValidacionPropiedades = new Servicio();
    this.recepcionValidacionPropiedades.nombre = 'Validación Recepción';
    this.recepcionValidacionPropiedades.props = ['Correo Electrónico', 'SMS'];

  }
  isRequired(): ValidatorFn {
    return () => {
      if (false) {
        return { required: true };
      } else {
        return null;
      }
    };
  }

}
