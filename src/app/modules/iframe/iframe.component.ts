import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FuseNavigation} from '@fuse/types';
import {AuthenticationService} from '@core/services/authentication.service';
import {FuseSplashScreenService} from '@fuse/services/splash-screen.service';
import {finalize} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {Helper} from '@shared/common/helper';
import {SettingsService} from '@core/services/settings.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Component({
    selector: 'app-iframe',
    templateUrl: './iframe.component.html',
    styleUrls: ['./iframe.component.scss'],
    providers: [DatePipe],
})
export class IframeComponent implements OnInit, OnDestroy {
    idMenu = '';
    Menus: FuseNavigation[];
    iframe = '';
    Url = '';
    usuario = '';
    vpc = '';
    flag = false;
    myDate = new Date();
    finishDate: string;
    openIframe = true;
    reintentos = 6;
    TOReinteno = undefined;
    private sub: any;

    constructor(
        private datePipe: DatePipe,
        private _authService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _settings: SettingsService,
        private _snackBar: MatSnackBar
    ) {
        this.finishDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    }

    ngOnInit(): void {
        this.getUrlParams();
    }

    getUrlParams(): void {
        if (this._settings.isInternet) {
            this.sub = this.route.params.subscribe((params) => {
                this.flag = false;
                this.usuario = sessionStorage.getItem('User');
                this.vpc = sessionStorage.getItem('Key');
                this.idMenu = params.id.toString();
                this._authService.getAutorizar().subscribe(
                    (data) => {
                        if (data) {
                            this.ConsultarMenus();
                        }
                    },
                    (_error) => {
                        this.router.navigate(['login']);
                    }
                );
            });
        } else {
            this.sub = this.route.params.subscribe((params) => {
                this.flag = false;
                this.usuario = sessionStorage.getItem('User');
                this.vpc = sessionStorage.getItem('Key');
                this.idMenu = params.id.toString();
                this.cargarFrame();
            });
        }
    }

    /**
     * Cargue iframe INTRANET
     */
    cargarFrame(): void {
        try {
            if (this.reintentos > 0) {
                const menu = JSON.parse(atob(sessionStorage.getItem('configuracion')));
                let tareaEncontrada = null;
                menu.map((x) => {
                    const object = x.children.map((z) => z.children).map((y) => y);
                    object.forEach((element) => {
                        element.forEach((e) => {
                            e.children.forEach((item) => {
                                if (item.id_tarea.toString() === this.idMenu) {
                                    tareaEncontrada = item;
                                    return;
                                }
                            });
                        });
                    });
                });

                if (tareaEncontrada?.vence_token && tareaEncontrada.vence_token == 1) {

                    this._authService.nextisNotificationInactiveEnabled(true);
                    this._authService.nextIsInactive(true);

                    if (!this._settings.isInternet) {
                        this._authService.isAuthenticated$.next(true);
                    }
                    this.validarUsuario(tareaEncontrada);
                } else {

                    this._authService.nextisNotificationInactiveEnabled(false);
                    this._authService.nextIsInactive(true);

                    if (!this._settings.isInternet) {
                        this._authService.isAuthenticated$.next(false);
                    }

                    this.buildFrameUrl(tareaEncontrada);
                }
                if (this.TOReinteno) {
                    clearTimeout(this.TOReinteno);
                }
            }
        } catch (e) {
            this.reintentos--;
            this.TOReinteno = setTimeout(() => {
                this.cargarFrame();
            }, 1000);
        }
    }

    /**
     * metodo para carge de iframe INTERNET
     * @constructor
     */
    Cargue = () => {
        this.openIframe = true;
        this.Menus.map((x) => {
            const object = x.children.map((z) => z.children).map((y) => y);
            object.forEach((element) => {
                element.forEach((e) => {
                    if (e.id_tarea.toString() === this.idMenu) {
                        if (e.iframe.toString() === '0') {
                            this.openIframe = false;
                        }
                        const date = new Date();
                        const formatDate = this.datePipe.transform(
                            date,
                            'yyyy-MM-ddTHH:mm:ss'
                        );
                        let token = `${formatDate};${this.usuario};${
                            this.vpc
                        };${sessionStorage.getItem('Token')};${e.id_tarea}`;
                        token = Helper.encrypt(
                            token,
                            this._settings.getSecretKey
                        );
                        this.Url = `${e.urlIframe}?token=${token}`;
                        return;
                    }
                });
            });
        });
        if (this.openIframe) {
            this.iframe = this.Url;
            this.flag = true;
        } else {
            window.open(this.Url, '_blank');
            this.iframe = '';
            this.flag = true;
        }
    };

    /**
     * Validar usuario INTRANET
     * @param tareaEncontrada
     */
    validarUsuario(tareaEncontrada): void {
        this._authService.getAutorizar().subscribe(
            (result) => {
                if (result) {
                    this.buildFrameUrl(tareaEncontrada);
                }
            },
            (_error) => this.router.navigate(['login'])
        );
    }

    buildFrameUrl(tareaEncontrada: any): void {
        if (tareaEncontrada.token_jwt === 0) {
            this.Url =
                tareaEncontrada.urlIframe +
                '?token=' +
                sessionStorage.getItem('User');
        } else {
            if (
                !['', '--', undefined, null, '-1'].includes(
                    tareaEncontrada.urlIframe
                )
            ) {
                this.Url =
                    `${
                        tareaEncontrada.urlIframe
                    }?token=${sessionStorage.getItem('User')};` +
                    `${sessionStorage.getItem('Key')};${
                        tareaEncontrada.id_tarea
                    };${tareaEncontrada.titleMenu};` +
                    `${tareaEncontrada.grupo};${tareaEncontrada.title};V.${tareaEncontrada.version};` +
                    `${
                        tareaEncontrada.id_interno
                    }&TokenJWT=${sessionStorage.getItem('Token')}`;
            } else {
                this._snackBar.open(
                    'No se encontró una ruta para esta página.',
                    'ACEPTAR',
                    new MatSnackBarConfig()
                );
                this.router.navigate(['Index']);
            }
        }
        this.iframe = this.Url;
        this.flag = true;
    }


    /**
     * Consultar menus INTERNET
     * @constructor
     */
    ConsultarMenus = () => {
        this._authService
            .getMenu(this.usuario)
            .pipe(
                finalize(() => {
                    this._fuseSplashScreenService.hide();
                })
            )
            .subscribe((data: FuseNavigation[]) => {
                if (data && data.length > 0) {
                    this.Menus = data;
                    this.Cargue();
                }
            });
    }

    ngOnDestroy(): void {
        if (this.TOReinteno) {
            clearTimeout(this.TOReinteno);
        }
    }

    overOutIframe() {
        if (sessionStorage.getItem('Token') && this._authService.captureClick) {
            this._authService.nextIsInactive(true);
        }
    }
}
