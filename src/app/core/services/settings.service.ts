import {Injectable} from '@angular/core';
import * as configEnv from '@assets/config/config.json';
import {HttpHeaders} from '@angular/common/http';
import {environment} from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {

    private _isInternet: boolean;
    private _timeOfInactivity: number;
    private _noficationTimeOfInactivity: number;

    constructor() {
        this.isInternet = configEnv.isInternet;
        this._timeOfInactivity = configEnv.timeOfInactivity;
        this._noficationTimeOfInactivity = configEnv.noficationTimeOfInactivity;
    }

    get timeOfInactivity(): number {
        return this._timeOfInactivity;
    }

    get noficationTimeOfInactivity(): number {
        return this._noficationTimeOfInactivity;
    }

    get isInternet(): boolean {
        return this._isInternet;
    }

    set isInternet(value: boolean) {
        this._isInternet = value;
    }

    get getSecretKey() {
        return environment.Secret_Key;
    }

    get getUrlOnboarding() {
        let url: string = undefined;
        if (this.isInternet) {
            url = environment.internetUtilities.PathOnBoarding;
        }
        return url;
    }

    public generateHeaders(): any[] {
        let headers;
        if (this.isInternet) {
            const basicHeader = this.generateBasicHeaders_Internet();
            const tokenHeader = this.generateBasicHeadersJWT_Internet();
            headers = [basicHeader, tokenHeader];
        } else {
            const basicHeader = this.generateBasicHeaders_Intranet();
            const tokenHeader = this.generateBasicHeadersJWT_Intranet();
            headers = [basicHeader, tokenHeader];
        }
        return headers;
    }

    protected generateBasicHeadersJWT_Internet(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key':
            environment.internetUtilities.SubscriptionKey,
            Authorization: 'Bearer ' + sessionStorage.getItem('Token'),
        });
    }

    protected generateBasicHeadersJWT_Intranet(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('Token'),
        });
    }

    // noinspection JSMethodCanBeStatic
    private generateBasicHeaders_Internet(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key':
            environment.internetUtilities.SubscriptionKey,
        });
    }

    private generateBasicHeaders_Intranet(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
        });
    }
}
