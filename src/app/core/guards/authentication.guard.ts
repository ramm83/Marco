import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanLoad,
    Route,
    Router,
    RouterStateSnapshot,
    UrlSegment,
    UrlTree,
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthenticationService} from '@core/services/authentication.service';
import {catchError} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate, CanLoad {
    constructor(
        private _router: Router,
        private _authService: AuthenticationService,
        private _snackBar: MatSnackBar
    ) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const TOKEN = sessionStorage.getItem('Token');
        const USER = sessionStorage.getItem('User');
        if (TOKEN && USER) {
            return true;
        } else {
            this.showSnackBar('!Sin permisos, Inicie Sesión!');
            return false;
        }

    }

    canLoad(
        route: Route,
        segments: UrlSegment[]
    ): Observable<boolean> | Promise<boolean> | boolean {
        const TOKEN = sessionStorage.getItem('Token');
        const USER = sessionStorage.getItem('User');
        if (TOKEN && USER) {
            return this._authService.getAutorizar().pipe(
                catchError(() => {
                    this.showSnackBar(
                        '¡Sesión expirada, Inicie sesión nuevamente!'
                    );
                    return of(false);
                })
            );
        } else {
            this.showSnackBar();
        }
        return false;
    }

    private showSnackBar(
        message: string = '¡Inicie sesión por favor!',
        action: string = 'Cerrar'
    ) {
        this._snackBar.open(message, action, {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['blue-snackbar'],
        });
        this._authService.isAuthenticated$.next(false);
        this._router.navigate(['/auth/login']);
    }
}
