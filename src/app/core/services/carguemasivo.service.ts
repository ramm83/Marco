import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Cargue, CargueMasivo, Reporte} from '@shared/models/CM.model';
import {SettingsService} from './settings.service';
import {environment} from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class CarguemasivoService {
    private internetUtilities: any;
    private intranetUtilities: any;
    private basicHeader: HttpHeaders;

    constructor(private http: HttpClient, private _settings: SettingsService) {
        this.internetUtilities = environment.internetUtilities;
        this.intranetUtilities = environment.intranetUtilities;
        this.basicHeader = this._settings.generateHeaders()[0];
    }

    GetInfoReporte(parametros: string): any {
        let url = this._settings.isInternet
            ? this.internetUtilities.PathApi
            : this.intranetUtilities.accesoDatos;
        const reporte: Reporte = {
            Tag: 'CGETCMUSBA',
            Parametros: parametros,
            Separador: '#',
        };
        return this.http.post<any>(
            `${url}/Reportes/GetReporteObjTag`,
            reporte,
            {headers: this.basicHeader}
        );
    }

    GetReporteInfo(Datos: Cargue): any {
        let url = `${this.intranetUtilities.accesoDatos}/CarguesMasivos/GetCargueMasivoTipo`;
        if (this._settings.isInternet) {
            url = `${this.internetUtilities.PathApi}/CargueMasivo/GetCargueMasivoTipo`;
        }
        return this.http.post<any>(url, Datos, {headers: this.basicHeader});
    }

    EjecutarCM(cm: CargueMasivo): any {
        let url = `${this.intranetUtilities.accesoDatos}/CarguesMasivos/EjecutarCM`;
        if (this._settings.isInternet) {
            url = `${this.internetUtilities.PathApi}/CargueMasivo/EjecutarCM`;
        }
        return this.http.post<any>(url, cm, {headers: this.basicHeader});
    }
}
