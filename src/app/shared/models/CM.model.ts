export class CargueMasivo {
    IdTipoCM: number;
    CantidadLineas: number;
    LstLineas: [];
    Usuario: string;
}

export class Reporte {
    Tag: string;
    Parametros: string;
    Separador: string;
}

export class CargueGrafico {
    IdTipoCM: number;
    IdCargue: number;
    Descripcion: string;
    rowData: any;
    columnDefs: any;
}

export class Cargue {
    IdTipoCM: number;
    IdCargue: number;
}
