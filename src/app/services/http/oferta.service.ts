import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urlMongo } from '../../model/util/LigasUtil';

@Injectable({
  providedIn: 'root'
})
export class OfertaService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  // Create Oferta
  async createOferta(id: string, data, token: string) {
    this.headers = this.headers.set('Authorization', token);
    const url = urlMongo + `oferta/${id}`;
    console.log(url);
    let response = 'OK';
    const creaOf = this.http.post(url, data, { headers: this.headers });
    await creaOf.toPromise().
      then((res) => {
        console.log(res);
        if (res['errorType']) {
          response = `Ocurrio un error, favor de reintentar. ${JSON.stringify(res['errorType'])}`;
        }
      }).catch((err) => {
        console.log(err);
        response = `Ocurrio un error, favor de reintentar. ${JSON.stringify(err)}`;
      });
    return response;
  }

  // Get customer id
  async getOferta(id: string, token: string) {
    let response = {};
    this.headers = this.headers.set('Authorization', token);
    await this.http.get(urlMongo + `oferta/${id}/`, { headers: this.headers })
      .toPromise().then((res) => {
        console.log(res);
        if (res['errorType']) {
          response = { error: 'Error, favor de volver a intentar' };
        } else {
          response = res;
        }
      }).catch((err) => {
        console.log(err);
        response = { error: 'Error, favor de volver a intentar' };
      });
    return response;
  }

  // Update Oferta
  async updateOferta(id: string, data, token: string) {
    let response = 'OK';
    this.headers = this.headers.set('Authorization', token);
    await this.http.put(urlMongo + `oferta/${id}/`, data, { headers: this.headers })
      .toPromise().
      then((res) => {
        console.log(res);
        if (res['errorType']) {
          response = `Ocurrio un error, favor de reintentar. ${JSON.stringify(res['errorType'])}`;
        }
      }).catch((err) => {
        console.log(err);
        response = `Ocurrio un error, favor de reintentar. ${JSON.stringify(err)}`;
      });
    return response;
  }

}
