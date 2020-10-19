export const environment = {
    production: true,
    hmr: false,
    Secret_Key: "$G1Int3rnet*.**",
    internetUtilities: {
        PathApi: 'https://apim-qa-proxy.sodhc.co',
        SubscriptionKey: '442c55ae313642028c9eb69dc4220dad',
        PathOnBoarding: "https://sglhubproveedoresprb.homecenter.co/Aplicaciones/RegistroProveedor/"
    },
    intranetUtilities: {
        backgroundApi: 'http://10.23.14.163:9000/Servicios/BackGround_1.0.0',
        PathApi: "http://10.23.14.94:8995/Servicios/Autenticacion_JWT",
        PathApiUsuarios: "http://10.23.14.163:9000/Servicios/Seguridad_1.0.0",
        accesoDatos: 'http://10.23.14.94:8995/Servicios/AccesoDatos_1.0.0/api',
    },
};