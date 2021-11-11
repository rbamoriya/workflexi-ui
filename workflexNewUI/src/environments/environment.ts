// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Please use only local backend server for development, DO NOT point to production
export const environment = {
   production: false,
   apiEndpoint: 'http://localhost:8080/workflexi-api',
   saUsername: 'workflexi_service_account',
   saPassword: 'abc123',
   razorpayAPIKey: 'rzp_live_67hUahtV1mBGse',
   reCaptchaSiteKey: '6LcRWtEaAAAAAB6XWeK2SXTjHK_5VZz7qyFyiNJt'
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
