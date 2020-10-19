import {Component, OnInit} from '@angular/core';
import {finalize, map} from 'rxjs/operators';
import {AuthenticationService} from '../../core/services/authentication.service';
import {FuseSplashScreenService} from '../../../@fuse/services/splash-screen.service';
import {Helper} from '../../shared/common/helper';
import * as _ from 'lodash';
import {SettingsService} from '../../core/services/settings.service';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {

    time = 250;
    aumento = 500;


    items = [ ];

    items2 = [ ];

    items3 = [ ];


    constructor(
        private _authService: AuthenticationService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _settings: SettingsService,
    ) {
    }

    ngOnInit(): void {

        // Enable notifications inactivity and token
        this._authService.nextisNotificationInactiveEnabled(true);
        this._authService.nextIsInactive(true);

        if (!this._settings.isInternet) {
            this._authService.isAuthenticated$.next(true);
        }
        // --

        if (sessionStorage.getItem('Token')) {
            this._authService.nextIsInactive(true);
        }

        // this._fuseSplashScreenService.show();
        const USER = sessionStorage.getItem('User');
        this._authService
            .getLastAccess(USER, '2')
            .pipe(
                map((response: any[]) => Helper.organizeMenu(response, true)),
                map((response: any) => Helper.buildMenu(response)),
                map((response: any) => this.test(response)),
                finalize(() => this._fuseSplashScreenService.hide())
            )
            .subscribe(data => {
                this.items = data['Aplicaciones'] ? data['Aplicaciones'] : [];
                this.items2 = data['Reportes'] ? data['Reportes'] : [];
                this.items3 = data['Cargues Masivos'] ? data['Cargues Masivos'] : [];
            });
    }

    private test(dataMenu: any[]) {
        const groups = [];
        dataMenu.forEach((zeroLevel) => {
            zeroLevel.children.forEach((firstLevel) => {
                firstLevel.children.forEach((secondLevel) => {
                    secondLevel.children.forEach((thirdLevel) => {
                        const temp = {};
                        temp['lvl0'] = zeroLevel.title;
                        temp['lvl1'] = firstLevel.title;
                        temp['lvl2'] = secondLevel.title;
                        temp['lvl3'] = thirdLevel.title;
                        temp['item'] = thirdLevel;
                        groups.push(temp);
                    });
                });
            });
        });

        return _.groupBy(groups, 'lvl0');
    }

}
