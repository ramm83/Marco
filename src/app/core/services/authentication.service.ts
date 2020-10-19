import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {SettingsService} from './settings.service';
import {environment} from '@env/environment';
import {Helper} from '@shared/common/helper';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    usuario: string;
    contrasena: string;
    isAuthenticated$ = new Subject<boolean>();
    private internetUtilities: any;
    private intranetUtilities: any;
    private basicHeader: HttpHeaders;
    private basicHeaderJWT: HttpHeaders;
    usr = new BehaviorSubject<string>('');
    private _isInactive = new BehaviorSubject<boolean>(true);
    private _isNotificationInactiveEnabled = new BehaviorSubject<boolean>(true);
    private _captureClick = true;

    constructor(private http: HttpClient, private _settings: SettingsService) {
        this.internetUtilities = environment.internetUtilities;
        this.intranetUtilities = environment.intranetUtilities;
        [
            this.basicHeader,
            this.basicHeaderJWT,
        ] = this._settings.generateHeaders();
    }

    get isNotificationInactiveEnabled(): BehaviorSubject<boolean> {
        return this._isNotificationInactiveEnabled;
    }

    nextisNotificationInactiveEnabled(enabled: boolean) {
        this._isNotificationInactiveEnabled.next(enabled);
    }

    get captureClick(): boolean {
        return this._captureClick;
    }

    set captureClick(value: boolean) {
        this._captureClick = value;
    }

    get isInactive(): Subject<any> {
        return this._isInactive;
    }

    nextIsInactive(active: boolean) {
        this._isInactive.next(active);
    }

    callGenerateHeadersJWT() {
        this.basicHeaderJWT = this._settings.generateHeaders()[1];
    }

    postLogin(
        username: string,
        password: string
    ): Observable<HttpResponse<any>> {
        let url: string;
        if (this._settings.isInternet) {
            url =
                this.internetUtilities.PathApi +
                '/logisticaSeguridadAutenticacion/login';
        } else {
            url = this.intranetUtilities.PathApi + '/api/authentication/login';
        }

        this.usuario = username;
        this.contrasena = password;
        const hdrsaLogin = this.basicHeader;
        return this.http.post(
            url,
            {userName: this.usuario, password: this.contrasena},
            {
                headers: hdrsaLogin,
                observe: 'response',
            }
        );
    }

    getAutorizar(): Observable<boolean> {
        let url: string;
        if (this._settings.isInternet) {
            url =
                this.internetUtilities.PathApi +
                '/logisticaSeguridadAutenticacion/authenticated';
        } else {
            url =
                this.intranetUtilities.PathApi +
                '/api/authentication/authenticated';
        }
        return this.http.get<boolean>(url, {
            headers: this.basicHeaderJWT,
        });
    }

    public getMenu(usuario: string) {
        const parametros = new HttpParams().set(
            'usuario',
            `${usuario}${this._settings.isInternet ? '-1' : '-0'}`
        );
        let url: string = `${this.intranetUtilities.PathApiUsuarios}/api/Autenticacion/UserAuth`;
        if (this._settings.isInternet) {
            url = `${this.internetUtilities.PathApi}/logisticaSeguridadOpc/Autenticacion/UserAuth`;
        }
        return this.http.get(url, {
            headers: this.basicHeaderJWT,
            params: parametros,
        });
    }

    public getLastAccess(usuario: string, last: string) {
        const parametros = new HttpParams().set(
            'usuario',
            `${usuario}${this._settings.isInternet ? '-1' : '-0'}-${last}`
        );
        let url = `${this.intranetUtilities.PathApiUsuarios}/api/Autenticacion/UserAuth`;
        if (this._settings.isInternet) {
            url = `${this.internetUtilities.PathApi}/logisticaSeguridadOpc/Autenticacion/UserAuth`;
        }
        return this.http.get(url, {
            headers: this.basicHeaderJWT,
            params: parametros,
        });
    }

    public getUserInfo(usuario: string): Observable<any> {
        let url: string;
        if (this._settings.isInternet) {
            url =
                this.internetUtilities.PathApi +
                '/logisticaSeguridadOpc/Usuario/UserInfo';
        } else {
            url =
                this.intranetUtilities.PathApiUsuarios +
                '/api/Usuario/UserInfo';
        }
        const parametros = new HttpParams().set('usuario', usuario);
        return this.http.get(url, {
            headers: this.basicHeaderJWT,
            params: parametros,
        });
    }

    Logout(): Observable<HttpResponse<any>> {
        let url: string;
        if (this._settings.isInternet) {
            url =
                this.internetUtilities.PathApi +
                '/logisticaSeguridadAutenticacion/logout';
        } else {
            url = this.intranetUtilities.PathApi + '/api/authentication/logout';
        }
        this.usuario = sessionStorage.getItem('User');
        this.contrasena = '';
        return this.http.post(
            url,
            {userName: this.usuario, password: this.contrasena},
            {
                headers: this.basicHeaderJWT,
                observe: 'response',
            }
        );
    }

    percistAccess(id_tarea: string): void {
        const objPersist = this.getObjPersist(id_tarea, '');
        if (this._settings.isInternet) {
            this.percistAccessInternet(objPersist).subscribe();
        } else {
            this.percistAccessIntranet(objPersist).subscribe();
        }
    }

    private percistAccessInternet(data): Observable<any> {
        const payload = Helper.encrypt(
            JSON.stringify(data),
            this._settings.getSecretKey
        );
        let url =
            this.internetUtilities.PathApi +
            '/ACCESODATOS/SGL/ProFncStoreProcedureTagInt32';
        return this.http.post(
            url,
            {Parametros: payload},
            {
                headers: this.basicHeaderJWT,
            }
        );
    }

    private percistAccessIntranet(data) {
        return this.http.post(
            this.intranetUtilities.accesoDatos +
            '/SGL/FncStoreProcedureTagInt32',
            data,
            {
                headers: this.basicHeaderJWT,
            }
        );
    }

    private getObjPersist(id_tarea: string, ip: string): any {
        return {
            Tag: 'ETQGETLOTE',
            Procedimiento: 'PKG_SGL.PRC_TOKEN_JWT',
            Parametros: [
                {
                    Nombre: 'P_USUARIO',
                    Tipo: 'S',
                    IntValor: 0,
                    DouValor: 0,
                    StringValor: this.usr.getValue(),
                    DateValor: '',
                    Entrada: true,
                },
                {
                    Nombre: 'P_TRANSACCION',
                    Tipo: 'S',
                    IntValor: 0,
                    DouValor: 0,
                    StringValor: 'I',
                    DateValor: '',
                    Entrada: true,
                },
                {
                    Nombre: 'P_ID_TAREA',
                    Tipo: 'I',
                    IntValor: id_tarea,
                    DouValor: 0,
                    StringValor: '',
                    DateValor: '',
                    Entrada: true,
                },
                {
                    Nombre: 'P_IP_CONEXION',
                    Tipo: 'S',
                    IntValor: 0,
                    DouValor: 0,
                    StringValor: ip,
                    DateValor: '',
                    Entrada: true,
                },
                {
                    Nombre: 'P_TOKEN',
                    Tipo: 'S',
                    IntValor: 0,
                    DouValor: 0,
                    StringValor: sessionStorage.getItem('Token'),
                    DateValor: '',
                    Entrada: true,
                },
                {
                    Nombre: 'P_SALIDA',
                    Tipo: 'I',
                    IntValor: 0,
                    DouValor: 0,
                    StringValor: '',
                    DateValor: '',
                    Entrada: false,
                },
            ],
        };
    }
}
