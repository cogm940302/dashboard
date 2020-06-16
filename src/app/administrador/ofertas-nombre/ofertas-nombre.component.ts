import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Servicio, Ofertas, Oferta } from 'app/model/Clientes';


@Component({
  selector: 'app-ofertas-nombre',
  templateUrl: './ofertas-nombre.component.html',
  styleUrls: ['./ofertas-nombre.component.css']
})
export class OfertasNombreComponent implements OnInit {


  @Input() servicios: any[] = [];
  serviciosConvertidos: Servicio[];
  bloqueados = ['Daon-Selfie', 'Daon-Documento', 'Daon-Prueva de vida'];
  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;
  @ViewChild('nombreOferta', { static: true }) nombreOferta: ElementRef;
  @Input() todasLasOfertasAgregadas: Ofertas;
  @Output() todasLasOfertasAgregadasReturn = new EventEmitter<String>();
  unaSolaOfertaConNombre: Oferta;
  servicioTemp: Servicio[] = [];
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      orders: new FormArray([])
    });
    console.log(this.servicios);
    // console.log(this.todasLasOfertasAgregadas);
    if (!this.todasLasOfertasAgregadas || this.isEmpty(this.todasLasOfertasAgregadas)) {
      this.todasLasOfertasAgregadas = new Ofertas();
      this.todasLasOfertasAgregadas.ofertas = [];
    } else {
      // this.onOptionsSelected('0');
    }
    this.convertOffer();
    this.addCheckboxes();
    // this.onOptionsSelected('0');
  }

  convertOffer() {
    this.serviciosConvertidos = [];
    const map = new Map();
    for (let i = 0 ; i < this.servicios.length; i++) {
      if (map.has(this.servicios[i].tipo)) {
        const arreglo = map.get(this.servicios[i].tipo);
        arreglo.push({nombre: this.servicios[i].nombre, id: this.servicios[i].id});
        map.set(this.servicios[i].tipo, arreglo);
      } else {
        const arreglo = [{nombre: this.servicios[i].nombre, id: this.servicios[i].id}];
        map.set(this.servicios[i].tipo, arreglo);
      }
    }
    map.forEach((value, key) => {
      const serv = new Servicio();
      serv.nombre = key;
      serv.props = value;
      this.serviciosConvertidos.push(serv);
    });
  }

  returnTemplateJson(nombreRaiz: string, nombre: string, id: string, tipo: string) {
    return `${nombreRaiz} = {nombre: '${nombre}',id: '${id}',tipo: '${tipo}',status: true}`;
  }

  returnOffer(ofertaToConvert: Ofertas) {
    const objetoRegreso = {};
    const cantidadDeOfertas = ofertaToConvert.ofertas;
    const ofertasRegreso = [];
    for (let i = 0; i < cantidadDeOfertas.length ; i++) {
      const nuevaOferta = {};
      nuevaOferta['nombre'] = cantidadDeOfertas[i].nombre;
      // TODO guardar los servicios nuevos
      const serviciosNuevos = [];
      const serviciosDeLasOfertas = cantidadDeOfertas[i].servicios;
      for (let j = 0; j < serviciosDeLasOfertas.length; j++) {
        const propiedadDeLasOfertas = serviciosDeLasOfertas[j].props;
        for (let k = 0 ; k < propiedadDeLasOfertas.length ; k++) {
          console.log(propiedadDeLasOfertas);
          console.log(propiedadDeLasOfertas[k]);
          serviciosNuevos.push(this.returnTemplateJson(
            ('' + propiedadDeLasOfertas[k]['nombre']).split(' ')[0].toLowerCase(),
            propiedadDeLasOfertas[k]['nombre'],
            propiedadDeLasOfertas[k]['id'], serviciosDeLasOfertas[j].nombre
          ));
        }
      }
      nuevaOferta['servicios'] = serviciosNuevos;
      //
      ofertasRegreso.push(nuevaOferta);
    }

    objetoRegreso['_id'] = ofertaToConvert._id;
    objetoRegreso['idcliente'] = ofertaToConvert.idcliente;
    objetoRegreso['ofertas'] = ofertasRegreso;
    console.log(objetoRegreso);
    console.log(JSON.stringify(objetoRegreso));
    return objetoRegreso;
  }

  addCheckboxes() {
    if (this.serviciosConvertidos) {
      console.log(this.serviciosConvertidos);
      this.serviciosConvertidos.forEach((o, i) => {
        console.log(o);
        console.log(i);
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
      this.servicioTemp[0].nombre = servicio;
      this.servicioTemp[0].props = [];
      this.servicioTemp[0].props.push(propiedad);
      console.log(this.servicioTemp[0]);
    } else {
      for (let i = 0; i < this.servicioTemp.length; i++) {
        if (this.servicioTemp[i].nombre === servicio) {
          if (this.servicioTemp[i].props.indexOf(propiedad) === -1) {
            this.servicioTemp[i].props.push(propiedad);
          }
          inserted = true;
        }
      }
      if (!inserted) {
        console.log(this.servicioTemp.length);
        const value = this.servicioTemp.length;
        this.servicioTemp[value] = new Servicio();
        this.servicioTemp[value].nombre = servicio;
        this.servicioTemp[value].props = [];
        if (this.servicioTemp[value].props.indexOf(propiedad) === -1) {
          this.servicioTemp[value].props.push(propiedad);
        }
      }
    }
  }

  removeValueToOferta(servicio: string, propiedad: object) {
    console.log('si entre a remove');
    for (let i = 0; i < this.servicioTemp.length; i++) {
      if (this.servicioTemp[i].nombre === servicio) {
        console.log('si encontre el servicio');
        const index = this.servicioTemp[i].props.indexOf(propiedad);
        console.log(index);
        if (index > -1) {
          this.servicioTemp[i].props.splice(index, 1);
          console.log('si lo di de baja');
        }
      }
    }
  }

  toogleCheckbox(event: any) {
    // console.log(event);
    console.log(event.target.name, event.target.value, event.target.checked);
    const valores = event.target.name.split('-');
    if (event.target.checked) {
      this.addValueToOferta(valores[0], {nombre: valores[1], id: valores[2] });
    } else {
      this.removeValueToOferta(valores[0],  {nombre: valores[1], id: valores[2] });
    }
  }

  get formData() { return this.form; }

  submit() {
    const cuantasOfertas = this.todasLasOfertasAgregadas.ofertas.length;
    console.log(cuantasOfertas);
    for (let i = 0; i < cuantasOfertas; i++) {
      if (this.todasLasOfertasAgregadas.ofertas[i].nombre === this.nombreOferta.nativeElement.value) {
        console.log('ese nombre de oferta ya existe');
        this.agregarOfertaDaon();
        this.todasLasOfertasAgregadas.ofertas[i].servicios = this.servicioTemp;
        this.servicioTemp = [];
        console.log('todaslasoferAgregadas' +  this.todasLasOfertasAgregadas);
        this.todasLasOfertasAgregadasReturn.emit( JSON.stringify( this.returnOffer( this.todasLasOfertasAgregadas) ) );
        this.uncheckAll();
        this.onOptionsSelected('0');
        return;
      }
    }
    this.agregarOfertaDaon();
    this.todasLasOfertasAgregadas.ofertas[cuantasOfertas] = new Oferta();
    this.todasLasOfertasAgregadas.ofertas[cuantasOfertas].nombre = this.nombreOferta.nativeElement.value;
    this.todasLasOfertasAgregadas.ofertas[cuantasOfertas].servicios = this.servicioTemp;
    this.servicioTemp = [];
    console.log('todaslasoferAgregadas' ,  this.todasLasOfertasAgregadas);
    console.log(this.todasLasOfertasAgregadas);
    console.log(JSON.stringify(this.todasLasOfertasAgregadas.ofertas));
    this.todasLasOfertasAgregadasReturn.emit( JSON.stringify( this.returnOffer(  this.todasLasOfertasAgregadas)) );
    this.uncheckAll();
    this.onOptionsSelected('0');
  }

  // TODO: metodo que se debera quitar cuando pase la fase de doan
  agregarOfertaDaon() {
    // this.addValueToOferta('Daon', 'Selfie');
    // this.addValueToOferta('Daon', 'Documento');
    // this.addValueToOferta('Daon', 'Prueva de vida');
  }

  uncheckAll() {
    this.nombreOferta.nativeElement.value = '';
    this.checkboxes.forEach((element) => {
      if (!this.bloqueados.includes(element.nativeElement.name)) {
        console.log(element.nativeElement.name);
        element.nativeElement.checked = false;
      }
    });
  }

  onOptionsSelected(value: string) {
    // selecciona la oferta del 'Select'
    this.uncheckAll();
    const ofertasCliente = this.todasLasOfertasAgregadas.ofertas[value];
    this.nombreOferta.nativeElement.value = ofertasCliente.nombre;

    for (let j = 0; j < ofertasCliente.servicios.length; j++) {
      const propiedades = ofertasCliente.servicios[j].props;
      for (let k = 0; k < propiedades.length; k++) {
        const nombreChecked = ofertasCliente.servicios[j].nombre + '-' + propiedades[k];
        this.checkboxes.forEach((element) => {
          if (element.nativeElement.name === nombreChecked) {
            element.nativeElement.checked = true;
          }
        });
      }
    }
  }


}
