// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  name: 'dev',
  // baseUrl: 'https://2u597e7kmf.execute-api.us-east-1.amazonaws.com/test/',
  baseUrl: 'https://dev-api.mitidentity.com/',
  tokenCognitoUrl: 'https://dev-auth.mitidentity.com/oauth2/token',
  region: 'us-east-1',

  identityPoolId: 'us-east-1:5b4956a8-7ba9-40ce-8395-ef20729c964f',
  userPoolId: 'us-east-1_KChp3JRPO',
  clientId: '586c04fjufjqpigcs9p10onog8',
  mandatorySignIn: 'true',
  logins: `cognito-idp.us-east-1.amazonaws.com/us-east-1_KChp3JRPO`,


  rekognitionBucket: 'rekognition-pics',
  albumName: 'usercontent',
  bucketRegion: 'us-east-1',

  cognito_idp_endpoint: '',
  cognito_identity_endpoint: '',
  sts_endpoint: '',
  dynamodb_endpoint: '',
  s3_endpoint: ''
};
