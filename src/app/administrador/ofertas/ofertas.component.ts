import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Servicio, Ofertas, Oferta } from 'app/model/Clientes';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {

  @Input() servicios: Servicio[] = [];
  bloqueados = ['Daon-Selfie', 'Daon-Documento', 'Daon-Prueva de vida'];
  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;
  @ViewChild('nombreOferta', { static: true }) nombreOferta: ElementRef;
  @Input() todasLasOfertasAgregadas: Ofertas;
  @Output() todasLasOfertasAgregadasReturn = new EventEmitter<Ofertas>();
  unaSolaOfertaConNombre: Oferta;
  servicioTemp: Servicio[] = [];
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }


  ngOnInit() {
    this.form = this.formBuilder.group({
      orders: new FormArray([])
    });
    console.log(this.todasLasOfertasAgregadas);
    if (!this.todasLasOfertasAgregadas || this.isEmpty(this.todasLasOfertasAgregadas)) {
      this.todasLasOfertasAgregadas = new Ofertas();
      this.todasLasOfertasAgregadas.ofertas = [];
    } else {
      // this.onOptionsSelected('0');
    }
    this.addCheckboxes();
    // this.onOptionsSelected('0');
  }

  addCheckboxes() {
    if (this.servicios) {
      console.log(this.servicios);
      this.servicios.forEach((o, i) => {
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

  addValueToOferta(servicio: string, propiedad: string) {
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

  removeValueToOferta(servicio: string, propiedad: string) {
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
    console.log(event.target.name, event.target.value, event.target.checked);
    const valores = event.target.name.split('-');
    if (event.target.checked) {
      this.addValueToOferta(valores[0], valores[1]);
    } else {
      this.removeValueToOferta(valores[0], valores[1]);
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
        this.todasLasOfertasAgregadasReturn.emit(this.todasLasOfertasAgregadas);
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
    console.log(JSON.stringify(this.todasLasOfertasAgregadas.ofertas));
    this.todasLasOfertasAgregadasReturn.emit(this.todasLasOfertasAgregadas);
    this.uncheckAll();
    this.onOptionsSelected('0');
  }

  // TODO: metodo que se debera quitar cuando pase la fase de doan
  agregarOfertaDaon() {
    this.addValueToOferta('Daon', 'Selfie');
    this.addValueToOferta('Daon', 'Documento');
    this.addValueToOferta('Daon', 'Prueva de vida');
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
