import { CognitoService } from 'app/services/aws/cognito.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MiddleMongoService } from './../../services/http/middle-mongo.service';
import { Ofertas, Clientes, Oferta } from 'app/model/Clientes';
import { OfertaService } from 'app/services/http/oferta.service';


@Component({
  selector: 'app-create-cliente',
  templateUrl: './create-cliente.component.html',
  styleUrls: ['./create-cliente.component.css']
})
export class CreateClienteComponent implements OnInit {

  // para las ofertas
  ofertasExistentes: Ofertas;
  // servciosDeOfertasExistentes: Servicio[];
  ofertasN: any[];
  abrir = false;

  // Clases
  cliente = new Clientes();
  ofertas: Ofertas;
  oferta: Oferta;
  ofertaAdd: Oferta;
  // servicio: Servicio;
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
  myForm = new FormGroup({
    nombre: new FormControl('', [this.isDupicate(), Validators.required]),
    correo: new FormControl('', [this.isDupicate(), Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    password: new FormControl(''),
    token: new FormControl(''),
    telefono: new FormControl('', [Validators.pattern('(([0-9]{10} ext [0-9]{1,4})|([0-9]{10}))')]),
    lisPos: new FormControl(''),
    lis: new FormControl(''),
    hrefDaon: new FormControl(''),
    nombreOferta: new FormControl(''),
    nombreOfertaAdd: new FormControl('', [this.isRequired()]),
    selectname: new FormControl(''),
    btnagregar: new FormControl(''),
  });
  filtersLoaded: Promise<boolean>;
  // tslint:disable-next-line: max-line-length
  constructor(public router: Router, public userService: CognitoService,
    private actRoute: ActivatedRoute, private client: MiddleMongoService,
    private ofertaService: OfertaService) {
    // console.log('use= ' + sessionStorage.getItem('lenguaje'));
    // this.translate.use(sessionStorage.getItem('lenguaje'));
    this.isDup = false;

    this.ofertas = new Ofertas();
    this.oferta = new Oferta();
  }

  async ngOnInit() {
    // await this.spinner.show();
    // await this.userService.isAuthenticated(this);
    this.ofertas = new Ofertas();
    this.ofertas._id = undefined;
    this.oferta = new Oferta();
    // this.servicio = new Servicio();
    this.ofertas.ofertas = [];
    this.cliente = new Clientes();

    // se recibe id cuando se va a actualizar el cliente
    this.actRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    // this.initOtherProperties();
    if (this.id !== undefined && this.id !== '') {
      this.agregar = false;
      this.botonValue = 'Actualizar';
      const tokenOauth = sessionStorage.getItem('tokenEdit');
      this.myForm.controls['nombre'].disable();
      // sessionStorage.removeItem('tokenEdit');
      const objectResponse = await this.client.getCustomer(this.id);
      // console.log(objectResponse);
      // console.log(JSON.stringify(objectResponse));
      if (objectResponse['error']) {
        // this.clienteError.mensaje = objectResponse['error'];
        this.router.navigate(['/dashboard']);
        return;
      }
      Object.assign(this.cliente, objectResponse['response']);
      Object.assign(this.ofertas, objectResponse['responseOferta']);
      this.oferta = this.ofertas.ofertas[(this.ofertas.ofertas.length - 1)];
      console.log(this.cliente);

      this.myForm.patchValue({
        correo: this.cliente.correo,
        nombre: this.cliente.nombre,
        password: this.cliente.pass,
        token: this.cliente.ApiToken,
        telefono: this.cliente.telefono,
        lisPos: this.cliente.listasBlancasPost,
        lis: this.cliente.listasBlancas,
        hrefDaon: this.cliente.hrefDaon
      });
      // await this.spinner.hide();
      this.filtersLoaded = Promise.resolve(true);

    } else {
      this.agregar = true;
      // await this.spinner.hide();
      this.filtersLoaded = Promise.resolve(true);
    }
    await this.sendOfer();
  }

  async sendOfer() {
    this.ofertasN = [];
    const selfie = {
      nombre: 'selfie',
      id: '1234567890',
      tipo: 'Biometricos',
      status: true
    };
    const documento = {
      nombre: 'documento',
      id: '1234567890',
      tipo: 'Biometricos',
      status: true
    };
    const prueba = {
      nombre: 'Prueba de Vida',
      id: '1234567890',
      tipo: 'Biometricos',
      status: true
    };
    const correo = {
      nombre: 'Correo Electrónico',
      id: '1234567890',
      tipo: 'Validacion Recepción',
      status: true
    };
    const sms = {
      nombre: 'SMS',
      id: '1234567890',
      tipo: 'Validacion Recepción',
      status: true
    };
    const rfc = {
      nombre: 'RFC',
      id: '1234567890',
      tipo: 'Validacion Información',
      status: true
    };
    const clabe = {
      nombre: 'Cuenta Clabe',
      id: '1234567890',
      tipo: 'Validacion Información',
      status: true
    };
    this.ofertasN.push(selfie);
    this.ofertasN.push(documento);
    this.ofertasN.push(prueba);
    this.ofertasN.push(correo);
    this.ofertasN.push(sms);
    this.ofertasN.push(rfc);
    this.ofertasN.push(clabe);

    // this.ofertasN[0] = new Servicio();
    // this.ofertasN[0].nombre = 'Daon';
    // this.ofertasN[0].props = ['Selfie', 'Documento', 'Prueva de vida'];
    // this.ofertasN[1] = new Servicio();
    // this.ofertasN[1].nombre = 'Validación Recepción';
    // this.ofertasN[1].props = ['Correo Electrónico', 'SMS'];

    this.abrir = true;
  }

  async getUserAndPass() {
    const datos = await (this.userService.creaClient(this.cliente.nombre));
    this.cliente.ApiToken = datos['UserPoolClient']['ClientId'];
    this.cliente.pass = datos['UserPoolClient']['ClientSecret'];
    if (this.cliente.ApiToken === undefined || this.cliente.pass === undefined) {
      return false;
    }
    return true;
  }

  async guardar() {
    // await this.spinner.show();
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
    this.cliente.listasBlancas = (this.myForm.controls.lis.value) === '' ? this.cliente.listasBlancas : ('' + this.myForm.controls.lis.value).split(",");

    if (this.myForm.invalid) {
      this.f.correo.updateValueAndValidity();
      console.log('no es un correo valido');
      // await this.spinner.hide();
      return;
    }
    console.log(this.cliente._id);
    if (this.cliente._id === undefined) {
      const resultCognito = await this.getUserAndPass();
      if (!resultCognito) {
        this.errorGenerico = 'Error, favor de volver a intentar';
      } else {
        this.errorGenerico = await this.client.createCustomer(this.cliente, this.ofertas);
      }
    } else {
      this.errorGenerico = await this.client.updateCustomer(this.cliente, this.id, this.cliente._id, this.ofertas);
    }
    if (this.errorGenerico === 'OK') {
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    } else {
      // await this.spinner.hide();
    }
  }

  recibeOferta(event) {
    console.log(event);
    this.ofertas = event;
  }

  logout() {
    this.userService.signOut();
    this.router.navigate(['RutasPublicas.login']);
  }

  // isLoggedIn(message: string, isLoggedIn: boolean) {
  //   if (!isLoggedIn) {
  //     this.logout();
  //     this.router.navigate([RutasPublicas.login]);
  //   }
  // }

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

  isRequired(): ValidatorFn {
    return () => {
      if (false) {
        return { required: true };
      } else {
        return null;
      }
    };
  }

  regresar() {
    this.router.navigate(['/dashboard']);
  }

  get f() { return this.myForm.controls; }

  // Otras propiedades
  // public recepcionValidacionPropiedades: Servicio;

  // initOtherProperties() {
  //   this.recepcionValidacionPropiedades = new Servicio();
  //   this.recepcionValidacionPropiedades.nombre = 'Validación Recepción';
  //   this.recepcionValidacionPropiedades.props = ['Correo Electrónico', 'SMS'];

  // }
}
