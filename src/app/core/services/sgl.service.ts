import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {SettingsService} from './settings.service';
import {environment} from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class SglService {
    bhv_newMessages = new BehaviorSubject<any>('');
    bhv_viewedMessages = new BehaviorSubject<any>(0);
    bhv_resetTimer = new BehaviorSubject<any>('');
    private basicHeader: HttpHeaders;

    constructor(private http: HttpClient, private _settings: SettingsService) {
        this.basicHeader = this._settings.generateHeaders()[0];
    }

    sglTareaEjecucion(parametros: any): any {
        let url = `${environment.intranetUtilities.backgroundApi}/PrcGestionEjecucion`;
        if (this._settings.isInternet) {
            url = `${environment.internetUtilities.PathApi}/logistica-background/PrcGestionEjecucion`;
        }
        // Pruebas background
        return this.http.post<any>(url, parametros, {
            headers: this.basicHeader,
        });
    }
}
