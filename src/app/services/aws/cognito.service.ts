import { Injectable } from '@angular/core';

import Auth from '@aws-amplify/auth';
import { ConsoleLogger } from '@aws-amplify/core';

// import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
// import * as AWS from 'aws-sdk/global';

// const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  constructor() { }

  // poolData = {
  //   UserPoolId: 'us-east-1_zlIK9rXul', // Your user pool id here
  //   ClientId: '1gagno0fctvkt483tidg6diktp', // Your client id here
  // };

  async signOut() {
    try {
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
          if (success.challengeName === 'NEW_PASSWORD_REQUIRED') {
            resultSignIn = 'NEW';
          } else {
            if (!success.attributes.email_verified) {
              resultSignIn = 'NOT';
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
