// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
export const environment = {
  production: false,

  firebase: {
    apiKey: 'AIzaSyAHHXCFeVqid9fOpnt2sKHbJViTFMXGQ8o',
    authDomain: 'd-assessment-online.firebaseapp.com',
    databaseURL: 'https://d-assessment-online.firebaseio.com',
    projectId: 'd-assessment-online',
    storageBucket: 'd-assessment-online.appspot.com',
    messagingSenderId: '874912498196'
  },

  handlerUserUrl: './handlerUser'
};
