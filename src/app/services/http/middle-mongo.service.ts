import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MiddleMongoService {

  constructor(private http: HttpClient) { }

  // Get all customer
  async getCustomers() {
    let response = {};
    // this.headers = this.headers.set('Authorization', await this.tokenService.generaToken('', ''));
    // await this.http.get(urlMongo + `cliente`, { headers: this.headers })
    await this.http.get('https://dev-api.mitidentity.com/' + `cliente`)
    .toPromise().then(async (res) => {
        response = res;
        console.log(res);
      }).catch((err) => {
        console.log(err);
      });
    return response;
  }
}
