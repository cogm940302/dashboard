export class Clientes {
    _id: string;
    nombre: string;
    correo: string;
    pass: string;
    ApiToken: string;
    telefono: string;
    listasBlancasPost: any[];
    listasBlancas: any[];
    hrefDaon: string;
    statusCliente: number;
  }

  export class Ofertas {
    _id: string;
    idcliente: string;
    ofertas: Oferta[];
    ofertascliente: OfertasCliente;
  }

  // export class Oferta {
  //   nombre: string;
  //   servicios: any[];
  // }

  export class Oferta {
    nombre: string;
    servicios: Servicio[];
  }

  export class Servicio {
    nombre: string;
    props: any[];
  }

  export class OfertasCliente {
    ofertas: Oferta[];
  }

