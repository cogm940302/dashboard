import { Injectable } from '@angular/core';

import Auth from '@aws-amplify/auth';
import { ConsoleLogger } from '@aws-amplify/core';

import * as AWS from 'aws-sdk/global';
import * as AWSCognito from 'aws-sdk';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { CognitoIdentity } from 'aws-sdk';
import { environment } from 'environments/environment';
import * as awsservice from 'aws-sdk/lib/service';

// import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
// import * as AWS from 'aws-sdk/global';

// const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

@Injectable({
  providedIn: 'root'
})
export class CognitoService {


  public cognitoCreds: AWS.CognitoIdentityCredentials;
  public accessKeyId: string;
  public secretAccessKey: string;
  public sessionToken: string;

  constructor() { }

  // poolData = {
  //   UserPoolId: 'us-east-1_zlIK9rXul', // Your user pool id here
  //   ClientId: '1gagno0fctvkt483tidg6diktp', // Your client id here
  // };

  async isLogguedIn() {
    return await Auth.currentAuthenticatedUser()
      .then((success) => {
        console.log(success);
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  async signOut() {
    try {
      sessionStorage.clear();
      await Auth.signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  async signIn(username: string, password: string) {
    console.log(username);
    console.log(password);
    let resultSignIn = '';
    console.log('voy hacer el login');
    console.log(Auth);
    await Auth.signIn(username, password)
      .then(
        (success) => {
          console.log(success);
          sessionStorage.setItem('jwtToken', success.signInUserSession.accessToken.jwtToken);
          if (success.challengeName === 'NEW_PASSWORD_REQUIRED') {
            console.log('segun es nuevo');
            resultSignIn = 'NEW';
          } else {
            if (!success.attributes.email_verified) {
              console.log('no voy a ir al else ');
              resultSignIn = 'NOT';
            } else {
              // this.buildCognitoCreds();
            }
          }
        }
      )
      .catch(err => {
        console.log('error', err);
        resultSignIn = 'ERROR';
      });
    return resultSignIn;
  }

  // getCurrentUser() {
  //   return this.getUserPool().getCurrentUser();
  // }

  // public _POOL_DATA: any = {
  //   UserPoolId: 'us-east-1_KChp3JRPO',
  //   ClientId: '586c04fjufjqpigcs9p10onog8'
  // };

  // getUserPool() {
  //   return new CognitoUserPool(this._POOL_DATA);
  // }

  async creaLasCredenciales() {
    console.log('segun voy en el else de cognito service');
    // const region = 'us-east-1';
    const currentSession = await Auth.currentCredentials();
    console.log(currentSession);
    this.accessKeyId = currentSession.accessKeyId;
    this.secretAccessKey = currentSession.secretAccessKey;
    this.sessionToken = currentSession.sessionToken;
    // AWS.config.region = region;
    // AWS.config.update({ region });
    // console.log(sessionStorage.getItem('jwtToken'));
    // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    //   IdentityPoolId: 'us-east-1:5b4956a8-7ba9-40ce-8395-ef20729c964f',
    //   Logins: {
    //     'cognito-idp.us-east-1.amazonaws.com/us-east-1_KChp3JRPO': sessionStorage.getItem('jwtToken')
    //   }
    // });

    // (AWS.config.credentials as AWS.CognitoIdentityCredentials).get(() => {
    //   console.log(`voy por las credenciales`);
    //   const accessKeyId = AWS.config.credentials.accessKeyId;
    //   const secretAccessKey = AWS.config.credentials.secretAccessKey;
    //   // const sessionToken = AWS.config.credentials.sessionToken;
    // }
    // );
  }
  getDatetime = function() {
    return (new Date).toLocaleTimeString();
  };

  async creaClient(nombreDelCliente: string) {
    await this.creaLasCredenciales();
    console.log(AWS.config.credentials);
    AWSCognito.config.credentials = AWS.config.credentials;
    console.log(AWSCognito.config.credentials);

    AWS.config.update({
      region: 'us-east-1',
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      sessionToken: this.sessionToken
    });
    const client = nombreDelCliente;
    const cognitoidentityserviceprovider = new AWSCognito.CognitoIdentityServiceProvider();
    const params = {
      ClientName: client, /* required */
      UserPoolId: 'us-east-1_KChp3JRPO', /* required */
      GenerateSecret: true,
      AllowedOAuthFlows: ['client_credentials'],
      AllowedOAuthScopes: ['MIT_Onboarding_RS/read', 'MIT_Onboarding_RS/write'],
      ExplicitAuthFlows: ['ALLOW_ADMIN_USER_PASSWORD_AUTH', 'ALLOW_REFRESH_TOKEN_AUTH', 'ALLOW_USER_SRP_AUTH', 'ALLOW_CUSTOM_AUTH'],
      RefreshTokenValidity: 3650,
      AllowedOAuthFlowsUserPoolClient: true,
    };
    const cred = await cognitoidentityserviceprovider.createUserPoolClient(params).promise();
    console.log(cred);
    return cred;
  }

  // buildCognitoCreds() {
  //   const idTokenJwt = sessionStorage.getItem('jwtToken');
  //   let url = 'cognito-idp.' + 'us-east-1' + '.amazonaws.com/' + 'us-east-1_KChp3JRPO';
  //   // if (environment.cognito_idp_endpoint) {
  //   //     url = environment.cognito_idp_endpoint + '/' + CognitoUtil._USER_POOL_ID;
  //   // }
  //   let logins: CognitoIdentity.LoginsMap = {};
  //   logins[url] = idTokenJwt;
  //   let params = {
  //     IdentityPoolId: 'us-east-1_KChp3JRPO', /* required */
  //     Logins: logins
  //   };
  //   let serviceConfigs = <awsservice.ServiceConfigurationOptions>{};
  //   // if (environment.cognito_identity_endpoint) {
  //   //     serviceConfigs.endpoint = environment.cognito_identity_endpoint;
  //   // }
  //   let creds = new AWS.CognitoIdentityCredentials(params, serviceConfigs);
  //   AWSCognito.config.credentials = creds;
  //   this.setCognitoCreds(creds);
  //   return creds;
  // }





  // setCognitoCreds(creds: AWS.CognitoIdentityCredentials) {
  //   this.cognitoCreds = creds;
  // }


  async changePass(username: string, oldPassword: string, newPassword: string) {
    let resultSignIn = '';

    await Auth.signIn(username, oldPassword)
      .then(async (user) => {
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
          await Auth.completeNewPassword(
            user,               // the Cognito User Object
            newPassword,       // the new password
            // OPTIONAL, the required attributes
            {
              email: user.challengeParam.userAttributes.email
            }
          ).then((userN: any) => {
            // at this time the user is logged in if no MFA required
            console.log(userN);
          }).catch(e => {
            console.log(e);
            resultSignIn = 'ERROR';
          });
        }
      }).catch(e => {
        console.log(e);
      });
    return resultSignIn;
  }

}
