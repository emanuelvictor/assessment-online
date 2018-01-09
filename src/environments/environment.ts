// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
export const environment = {
  production: false,

  firebase: {
    apiKey: "AIzaSyB8yIabxNk_4FgBqbdH2k87b24dX7T0LaI",
    authDomain: "assessment-online.firebaseapp.com",
    databaseURL: "https://assessment-online.firebaseio.com",
    projectId: "assessment-online",
    storageBucket: "assessment-online.appspot.com",
    messagingSenderId: "658372006724"
  }
};
