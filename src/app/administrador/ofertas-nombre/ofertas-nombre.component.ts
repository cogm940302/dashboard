import { MiddleOfertaMongoService } from './../../services/http/middle-oferta-mongo.service';
import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Servicio, Ofertas, Oferta } from 'app/model/Clientes';
import { Router } from '@angular/router';

const Swal = require('sweetalert2');

@Component({
  selector: 'app-ofertas-nombre',
  templateUrl: './ofertas-nombre.component.html',
  styleUrls: ['./ofertas-nombre.component.css']
})
export class OfertasNombreComponent implements OnInit {


  @Input() servicios: any[] = [];
  @Input() idCliente = '';
  serviciosConvertidos: Servicio[];
  bloqueados = ['Daon-Selfie', 'Daon-Documento', 'Daon-Prueva de vida'];
  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;
  @ViewChild('nombreOferta', { static: true }) nombreOferta: ElementRef;
  @Input() todasLasOfertasAgregadas: Ofertas;
  @Output() todasLasOfertasAgregadasReturn = new EventEmitter<String>();
  unaSolaOfertaConNombre: Oferta;
  isCreateOfer = false;
  servicioTemp: Servicio[] = [];
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private middleOferta: MiddleOfertaMongoService,
    public router: Router) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      orders: new FormArray([])
    });
    if (!this.todasLasOfertasAgregadas || !this.todasLasOfertasAgregadas.ofertas || this.isEmpty(this.todasLasOfertasAgregadas.ofertas)) {
      this.todasLasOfertasAgregadas = new Ofertas();
      this.todasLasOfertasAgregadas.ofertas = [];
      this.isCreateOfer = true;
    } else {
      // this.onOptionsSelected('0');
    }
    this.serviciosConvertidos = this.convertOffer(this.servicios);
    this.addCheckboxes();
  }

  convertOffer(serviciosAConvertir: any[]) {
    const serviciosCon = [];
    const map = new Map();
    for (const item in serviciosAConvertir) {
      if (map.has(serviciosAConvertir[`${item}`].tipo)) {
        const arreglo = map.get(serviciosAConvertir[`${item}`].tipo);
        arreglo.push({ nombre: serviciosAConvertir[`${item}`].nombre, id: serviciosAConvertir[`${item}`].id });
        map.set(serviciosAConvertir[`${item}`].tipo, arreglo);
      } else {
        const arreglo = [{ nombre: serviciosAConvertir[`${item}`].nombre, id: serviciosAConvertir[`${item}`].id }];
        map.set(serviciosAConvertir[`${item}`].tipo, arreglo);
      }
    }
    map.forEach((value, key) => {
      const serv = new Servicio();
      serv['nombre'] = key;
      serv['props'] = value;
      serviciosCon.push(serv);
    });
    return serviciosCon;
  }

  returnNameOfService(nombre: string) {
    const moreThanAWord = nombre.split(' ');
    nombre = nombre.replace(/\s/g, '');
    if (moreThanAWord && moreThanAWord.length > 1) {
      nombre =
        nombre.substring(0, 1).toLowerCase() + nombre.substring(1, nombre.length);
    } else {
      nombre = nombre.toLowerCase();
    }
    nombre = this.eliminarAcentos(nombre);
    return nombre;
  }

  eliminarAcentos(texto: string) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  returnOffer(ofertaToConvert: Ofertas) {
    const objetoRegreso = {};
    const cantidadDeOfertas = ofertaToConvert.ofertas;
    const ofertasRegreso = [];
    for (let i = 0; i < cantidadDeOfertas.length; i++) {
      const nuevaOferta = {};
      nuevaOferta['nombre'] = cantidadDeOfertas[i].nombre;
      const serviciosNuevos = {};
      const serviciosDeLasOfertas = cantidadDeOfertas[i].servicios;
      if (serviciosDeLasOfertas.length === undefined) {
        // tslint:disable-next-line: forin
        for (const item in serviciosDeLasOfertas) {
          serviciosNuevos[`${item}`] = serviciosDeLasOfertas[`${item}`];
        }
      } else {
        for (let j = 0; j < serviciosDeLasOfertas.length; j++) {
          const propiedadDeLasOfertas = serviciosDeLasOfertas[j]['props'];
          for (let k = 0; k < propiedadDeLasOfertas.length; k++) {
            serviciosNuevos[this.returnNameOfService(propiedadDeLasOfertas[k]['nombre'])] = {
              nombre: propiedadDeLasOfertas[k]['nombre'],
              tipo: serviciosDeLasOfertas[j]['nombre']
            };
          }
        }
      }
      nuevaOferta['servicios'] = serviciosNuevos;
      //
      ofertasRegreso.push(nuevaOferta);
    }

    objetoRegreso['_id'] = ofertaToConvert._id;
    objetoRegreso['idcliente'] = ofertaToConvert.idcliente;
    objetoRegreso['ofertas'] = ofertasRegreso;
    return objetoRegreso;
  }

  addCheckboxes() {
    if (this.serviciosConvertidos) {
      this.serviciosConvertidos.forEach((o, i) => {
        const control = new FormControl(false); // if first item set to true, else false
        (this.form.controls.orders as FormArray).push(control);
      });
    }
  }

  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  addValueToOferta(servicio: string, propiedad: object) {
    let inserted = false;
    if (this.isEmpty(this.servicioTemp)) {
      this.servicioTemp[0] = new Servicio();
      this.servicioTemp[0] = new Servicio();
      this.servicioTemp[0]['nombre'] = servicio;
      this.servicioTemp[0]['props'] = [];
      this.servicioTemp[0]['props'].push(propiedad);
    } else {
      for (let i = 0; i < this.servicioTemp.length; i++) {
        if (this.servicioTemp[i]['nombre'] === servicio) {
          if (this.servicioTemp[i]['props'].indexOf(propiedad) === -1) {
            this.servicioTemp[i]['props'].push(propiedad);
          }
          inserted = true;
        }
      }
      if (!inserted) {
        const value = this.servicioTemp.length;
        this.servicioTemp[value] = new Servicio();
        this.servicioTemp[value]['nombre'] = servicio;
        this.servicioTemp[value]['props'] = [];
        if (this.servicioTemp[value]['props'].indexOf(propiedad) === -1) {
          this.servicioTemp[value]['props'].push(propiedad);
        }
      }
    }
  }

  removeValueToOferta(servicio: string, propiedad: object) {
    for (let i = 0; i < this.servicioTemp.length; i++) {
      if (this.servicioTemp[i]['nombre'] === servicio) {
        const index = this.servicioTemp[i]['props'].findIndex(record => record.nombre === propiedad['nombre']);
        if (index > -1) {
          this.servicioTemp[i]['props'].splice(index, 1);
        }
      }
    }
  }

  toogleCheckbox(event: any) {
    const valores = event.target.name.split('-');
    if (event.target.checked) {
      this.addValueToOferta(valores[0], { nombre: valores[1], id: valores[2] });
    } else {
      this.removeValueToOferta(valores[0], { nombre: valores[1], id: valores[2] });
    }
  }

  get formData() { return this.form; }

  submit() {
    const cuantasOfertas = this.todasLasOfertasAgregadas.ofertas.length;
    for (let i = 0; i < cuantasOfertas; i++) {
      if (this.todasLasOfertasAgregadas.ofertas[i].nombre === this.nombreOferta.nativeElement.value) {
        this.todasLasOfertasAgregadas.ofertas[i].servicios = this.servicioTemp;
        this.servicioTemp = [];
        const objectRequest = this.returnOffer(this.todasLasOfertasAgregadas);
        this.createOrUpdateOfer(objectRequest, 'Oferta Actualizada');
        this.todasLasOfertasAgregadas.ofertas[i].servicios = objectRequest['ofertas'][i].servicios;
        this.uncheckAll();
        this.onOptionsSelected('0');
        return;
      }
    }
    this.todasLasOfertasAgregadas.ofertas[cuantasOfertas] = new Oferta();
    this.todasLasOfertasAgregadas.ofertas[cuantasOfertas].nombre = this.nombreOferta.nativeElement.value;
    this.todasLasOfertasAgregadas.ofertas[cuantasOfertas].servicios = this.servicioTemp;
    this.servicioTemp = [];

    const objectRequestNew = this.returnOffer(this.todasLasOfertasAgregadas);
    this.createOrUpdateOfer(objectRequestNew, 'Oferta Creada');

    this.todasLasOfertasAgregadas.ofertas[cuantasOfertas].servicios =
      objectRequestNew['ofertas'][cuantasOfertas].servicios;

    this.uncheckAll();
    this.onOptionsSelected('0');
  }


  createOrUpdateOfer(objectRequest: any, mensajeSwal: string) {
    if (this.isCreateOfer === true) {
      this.middleOferta.createOferta(this.idCliente, objectRequest);
    } else {
      this.middleOferta.updateOferta(this.idCliente, objectRequest);
    }
    Swal.fire({
      icon: 'success',
      title: mensajeSwal,
    });
  }

  uncheckAll() {
    this.nombreOferta.nativeElement.value = '';
    this.checkboxes.forEach((element) => {
      if (!this.bloqueados.includes(element.nativeElement.name)) {

        element.nativeElement.checked = false;
      }
    });
  }


  onOptionsSelected(value: string) {
    this.uncheckAll();
    const ofertasCliente = this.todasLasOfertasAgregadas.ofertas[value];
    this.nombreOferta.nativeElement.value = ofertasCliente.nombre;
    console.log(this.todasLasOfertasAgregadas.ofertas[value]);
    this.servicioTemp = this.convertOffer(this.todasLasOfertasAgregadas.ofertas[value].servicios);
    // tslint:disable-next-line: forin
    for (const item in ofertasCliente.servicios) {

      const nombreChecked = ofertasCliente.servicios[`${item}`].tipo + '-' + ofertasCliente.servicios[`${item}`].nombre;
      this.checkboxes.forEach((element) => {
        if (element.nativeElement.name === nombreChecked) {
          element.nativeElement.checked = true;
        }
      });

    }

  }


}
