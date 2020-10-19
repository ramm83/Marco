export const environment = {
    production: true,
    hmr       : false,
    Secret_Key: "$G1Int3rnet*.**",
    internetUtilities: {
        PathApi: 'https://apim-prod-proxy.sodhc.co',
        SubscriptionKey: '209fa70e5b0c4b5c8bddaf0aa54b8e19',
        PathOnBoarding: "https://sglhubproveedores.homecenter.co/Aplicaciones/RegistroProveedor/"
    },
    intranetUtilities: {
        backgroundApi: 'http://10.23.18.163:9000/Servicios/BackGround_1.0.0',
        PathApi: "http://10.23.18.164:8995/Servicios/Autenticacion_JWT",
        PathApiUsuarios: "http://10.23.18.163:9000/Servicios/Seguridad_1.0.0",
        accesoDatos: 'http://10.23.18.164:8995/Servicios/AccesoDatos_1.0.0/api',
    },
};
