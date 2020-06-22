
export const environment = {
    production: false,
    name: 'qa',
    // baseUrl: 'https://2u597e7kmf.execute-api.us-east-1.amazonaws.com/test/',
    baseUrl: 'https://qa-api.mitidentity.com/',
    tokenCognitoUrl: 'https://qa-auth.mitidentity.com/oauth2/token',
    region: 'us-east-1',

    identityPoolId: 'us-east-1:3996c1c2-d173-4568-82e3-81d1f0875565',
    userPoolId: 'us-east-1_ucIaja9HY',
    clientId: '4j1fcf502uve8vvkvsuhirfjvp',
    mandatorySignIn: 'true',
    logins: `cognito-idp.us-east-1.amazonaws.com/us-east-1_ucIaja9HY`,


    rekognitionBucket: 'rekognition-pics',
    albumName: 'usercontent',
    bucketRegion: 'us-east-1',

    cognito_idp_endpoint: '',
    cognito_identity_endpoint: '',
    sts_endpoint: '',
    dynamodb_endpoint: '',
    s3_endpoint: ''

};
