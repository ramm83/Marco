import {Component, Input, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {FuseSplashScreenService} from '../../../../../../@fuse/services/splash-screen.service';
import {AuthenticationService} from '@core/services/authentication.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-popover-user',
    templateUrl: './popover-user.component.html',
    styleUrls: ['./popover-user.component.scss']
})
export class PopoverUserComponent implements OnInit {
    @Input() user;
    @Input() letters;

    constructor(
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _authService: AuthenticationService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
    }

    public logout() {
        this._fuseSplashScreenService.show();
        this._authService
            .Logout()
            .pipe(
                finalize(() => {
                    sessionStorage.clear();
                    this._authService.isAuthenticated$.next(false);
                    this.router.navigateByUrl('auth/login');
                    this._fuseSplashScreenService.hide();
                })
            )
            .subscribe();
    }

}
