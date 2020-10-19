import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';
import {Router} from '@angular/router';
import {AuthenticationService} from '@core/services/authentication.service';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition,} from '@angular/material/snack-bar';
import {FuseSplashScreenService} from '@fuse/services/splash-screen.service';
import {SettingsService} from '@core/services/settings.service';

@Component({
    selector: 'login-2',
    templateUrl: './login-2.component.html',
    styleUrls: ['./login-2.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class Login2Component implements OnInit {
    loginForm: FormGroup;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    urlOnboarding = '';

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */

    public respuesta: any;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthenticationService,
        private _snackBar: MatSnackBar,
        private spinner: FuseSplashScreenService,
        private _settings: SettingsService
    ) {
        this.urlOnboarding = _settings.getUrlOnboarding;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        sessionStorage.clear();
        this.authService.usr.next('');
        this.loginForm = this._formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', Validators.required],
        });
    }

    autenticarUsuario(): void {
        this.spinner.show();
        try {
            if (this.loginForm.valid) {
                let usr: string = this.loginForm.value.username;
                usr = usr.toUpperCase();
                this.authService
                    .postLogin(usr, this.loginForm.value.password)
                    /*.pipe(finalize(() => this.spinner.hide()))*/
                    .subscribe(
                        (data) => {
                            this.respuesta = data;
                            if (data.status === 200) {
                                this.router.navigate(['/index']);
                                sessionStorage.setItem('User', usr);
                                sessionStorage.setItem(
                                    'Token',
                                    this.respuesta.body
                                );
                                this.authService.callGenerateHeadersJWT();
                                if (this._settings.isInternet) {
                                    this.authService.isAuthenticated$.next(
                                        true
                                    );
                                }
                                // validacion de menu
                                // this.validaMenu(usr);
                            }
                        },
                        (error) => {
                            this.spinner.hide();
                            switch (error.status) {
                                case 401:
                                    this.openSnackBar(
                                        'Credenciales de acceso incorrectas',
                                        'Cerrar'
                                    );
                                    break;
                                case 500:
                                    this.openSnackBar(
                                        'Error en el servicio de autenticación',
                                        'Cerrar'
                                    );
                                    break;
                            }
                        }
                    );
            } else {
                this.openSnackBar('Ingrese usuario y contraseña', 'Cerrar');
            }
        } catch (error) {
        }
    }

    openSnackBar = (message: string, action: string) => {
        this._snackBar.open(message, action, {
            duration: 2000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            panelClass: ['blue-snackbar'],
        });
    };
}
