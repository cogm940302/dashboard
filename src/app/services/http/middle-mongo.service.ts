import { CognitoService } from 'app/services/aws/cognito.service';
import { MiddleOfertaMongoService } from './middle-oferta-mongo.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { urlMongo } from 'app/model/util/LigasUtil';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MiddleMongoService {

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, private ofertaService: MiddleOfertaMongoService,
              public cognitoService: CognitoService, public router: Router) { }

  // Get all customer
  async getCustomers() {
    let response = {};
    this.headers = this.headers.set('Authorization', sessionStorage.getItem('jwtToken'));
    await this.http.get(urlMongo + `cliente`, { headers: this.headers })
    // await this.http.get('https://dev-api.mitidentity.com/' + `cliente`)
    .toPromise().then(async (res) => {
        response = res;
        // console.log(res);
      }).catch((err) => {
        console.log(err);
      });
    return response;
  }

  async getCustomer(id: string) {
    let response = {};
    const token = sessionStorage.getItem('jwtToken');
    this.headers = this.headers.set('Authorization', token);
    await this.http.get(urlMongo + `cliente/${id}`, { headers: this.headers })
      .toPromise().then(async (res) => {
        // console.log(res);
        if (res['errorType']) {
          response = { error: 'Error, favor de volver a intentar' };
        } else {
          response = res;
          const responseOferta = await this.ofertaService.getOferta(id);
          if (responseOferta['error']) {
            response = { error: 'Error, favor de volver a intentar' };
          } else {
            response = { response, responseOferta };
          }
        }
      }).catch((err) => {
        // console.log(err);
        response = { error: 'Error, favor de volver a intentar' };
        this.validaError(err);
      });
    // console.log(response);
    return response;
  }

 // Update Customer
 async updateCustomer(data, id: string, idOferta: string, dataOferta) {
  const url = urlMongo + `cliente/${id}`;
  let response = 'OK';
  console.log(JSON.stringify(dataOferta));
  this.headers = this.headers.set('Authorization', sessionStorage.getItem('jwtToken'));
  await this.http.put(url, data, { headers: this.headers })
    .toPromise().then(async (res) => {

      console.log(res);
      if (res['errorType']) {
        if (JSON.stringify(res['errorMessage']).includes('duplicate')) {
          response = `Error: El ${res['errorMessage']['key']} ya esta registrado`;
        } else {
          response = `Ocurrio un error, favor de reintentar. ${JSON.stringify(res['errorType'])}`;
        }
      } else {
        response = await this.ofertaService
          .updateOferta(idOferta, dataOferta);
      }

    }).catch((err) => {
      console.log(err);
      response = `Ocurrio un error, favor de reintentar. ${JSON.stringify(err)}`;
      this.validaError(err);
    });

  return response;
}

async createCustomer(data, dataOferta) {
  delete data._id;
  let response = 'OK';
  this.headers = this.headers.set('Authorization', sessionStorage.getItem('jwtToken'));

  await this.http.post(urlMongo + `cliente`, data, { headers: this.headers })
    .toPromise().then(async (res) => {
      // console.log(res);
      if (res['errorType']) {
        if (JSON.stringify(res['errorMessage']).includes('duplicate')) {
          response = `Error: El ${res['errorMessage']['key']} ya esta registrado`;
        } else {
          response = `Ocurrio un error, favor de reintentar. ${JSON.stringify(res['errorType'])}`;
        }
      } else {
        response = await this.ofertaService
          .createOferta(res['insertedId'], dataOferta);
      }
    }).catch((err) => {
      console.log(err);
      response = `Ocurrio un error, favor de reintentar. ${JSON.stringify(err)}`;
      this.validaError(err);
    });


  return response;
}
  validaError(err: string) {
    if ( err['error'] && err['error']['message'] && err['error']['message'].includes('expired')) {
      this.cognitoService.signOut();
      this.router.navigate(['/login']);
    }
  }
}
