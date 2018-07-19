// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyBKWApJaUAuyoxMIjUZakPNMX3pGbTBbi8',
    authDomain: 'stivi-development.firebaseapp.com',
    databaseURL: 'https://stivi-development.firebaseio.com',
    projectId: 'stivi-development',
    storage_bucket: 'stivi-development.appspot.com',
    messagingSenderId: '948120423616'
  }
};