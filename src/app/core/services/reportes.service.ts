import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SettingsService} from './settings.service';
import {environment} from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class ReportesService {
    private internetUtilities: any;
    private intranetUtilities: any;
    private basicHeader: HttpHeaders;

    constructor(private http: HttpClient, private _settings: SettingsService) {
        this.internetUtilities = environment.internetUtilities;
        this.intranetUtilities = environment.intranetUtilities;
        this.basicHeader = this._settings.generateHeaders()[0];
    }

    getReporte(idInterno: number): any {
        let url = this._settings.isInternet
            ? this.internetUtilities.PathApi
            : this.intranetUtilities.accesoDatos;
        return this.http.get(`${url}/Reportes/GetReporteIdSQL/${idInterno}`, {
            headers: this.basicHeader,
        });
    }

    getParametros(parametros: any): any {
        let url = this._settings.isInternet
            ? this.internetUtilities.PathApi
            : this.intranetUtilities.accesoDatos;
        return this.http.post(`${url}/Reportes/GetReporteObjTag`, parametros, {
            headers: this.basicHeader,
        });
    }

    getDatos(idInterno: number): any {
        let url = this._settings.isInternet
            ? this.internetUtilities.PathApi
            : this.intranetUtilities.accesoDatos;
        return this.http.get(`${url}/Reportes/GetReporteIdSQL/${idInterno}`, {
            headers: this.basicHeader,
        });
    }

    getReporteWhitParams(parametros: any): any {
        let url = this._settings.isInternet
            ? this.internetUtilities.PathApi
            : this.intranetUtilities.accesoDatos;
        return this.http.post(
            `${url}/Reportes/GetReporteObjIdSql`,
            parametros,
            {headers: this.basicHeader}
        );
    }

    getReporteBackgroundbyId(id: number): any {
        let url = `${this.intranetUtilities.backgroundApi}/PrcGetResultadoEjecucion/${id}`;
        if (this._settings.isInternet) {
            url = `${this.internetUtilities.PathApi}/logistica-background/PrcGetResultadoEjecucion/${id}`;
        }
        return this.http.get(url, {headers: this.basicHeader});
    }
}
