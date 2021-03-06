/*!

 =========================================================
 * Light Bootstrap Dashboard Angular - v1.6.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-angular2
 * Copyright 2016 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
// Amplify.configure(awsconfig);


Amplify.configure({
  Auth: {
      identityPoolId: environment.identityPoolId,
      region: environment.region,
      identityPoolRegion: environment.region,
      userPoolId: environment.userPoolId,
      userPoolWebClientId: environment.clientId,
      mandatorySignIn: environment.mandatorySignIn,
  }
});


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
