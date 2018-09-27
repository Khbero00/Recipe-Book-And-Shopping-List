// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  
  // Initialize Firebase
  firebase: {
    apiKey: 'AIzaSyA8gidDr3OnXGxwJ2xAy-drYgnS_qq08gI',
    authDomain: 'kb-recipe-app.firebaseapp.com',
    databaseURL: 'https://kb-recipe-app.firebaseio.com',
    projectId: 'kb-recipe-app',
    storageBucket: 'kb-recipe-app.appspot.com',
    messagingSenderId: '89719316060'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
