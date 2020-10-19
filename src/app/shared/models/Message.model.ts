export class Message {
    ID_EJECUCION: number;
    ID_INTERNO: number;
    ID_RESULTADO: number;
    USUARIO: string;
    PASO: string;
    FECHA_INICIO: Date;
    FECHA_FIN: Date;
    ID_TIPO_TAREA: number;
    TAREA: string;
    ID_MENSAJE: number;
    MENSAJE: string;
    TOTAL_REGISTROS: number;
    LIMITE: number;
    COLOR: string;
    ORDEN: number;
}

export class MessageGroup {
    ID_EJECUCION_TAREA: number;
    ID_TIPO_TAREA: number;
    TAREA: string;
    MENSAJES: Message[];
}

export class ConfEjecucionModel {
    Transaccion: string;
    Parametros: string;
    IdTarea: number;
    IdEjecucion: number;
    IdTipo: number;
    IdEstadoProceso: number;
    Usuario: string;
    LstLineas: [];
}
