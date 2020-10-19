// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
    production: false,
    hmr       : false,
    Secret_Key: "$G1Int3rnet*.**",
    internetUtilities: {
        PathApi: 'https://apim-dev-proxy.sodhc.co',
        SubscriptionKey: 'dfeb9e69860f45258647cc7ba45fb040',
        PathOnBoarding: "https://sglhubproveedoresprb.homecenter.co/Aplicaciones/RegistroProveedor/"
    },
    intranetUtilities:{
        backgroundApi: 'http://10.23.14.164:9000/Servicios/BackGround_1.0.0',
        PathApi: "http://10.23.14.95:8995/Servicios/Autenticacion_JWT",
        PathApiUsuarios: "http://10.23.14.164:9000/Servicios/Seguridad_1.0.0",
        accesoDatos: 'http://10.23.14.95:8995/Servicios/AccesoDatos_1.0.0/api',
    }
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
