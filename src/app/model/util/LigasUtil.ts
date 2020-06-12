import { environment } from '../../../environments/environment';
console.log(environment.name);
export const urlMongo = environment.baseUrl;
export const urlCognito = environment.tokenCognitoUrl;
