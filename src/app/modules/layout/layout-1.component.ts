import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {finalize, map, takeUntil} from 'rxjs/operators';

import {FuseConfigService} from '@fuse/services/config.service';
import {navigation} from 'app/navigation/navigation';
import {AuthenticationService} from '@core/services/authentication.service';
import {StorageService} from '@core/services/storage.service';
import {FuseSplashScreenService} from '@fuse/services/splash-screen.service';
import {Helper} from '@shared/common/helper';

@Component({
    selector: 'vertical-layout-1',
    templateUrl: './layout-1.component.html',
    styleUrls: ['./layout-1.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class VerticalLayout1Component implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _authService: AuthenticationService,
        private _storageService: StorageService,
        private _fuseSplashScreenService: FuseSplashScreenService
    ) {
        // Set the defaults
        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this._fuseSplashScreenService.show();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to config changes
        const USER = sessionStorage.getItem('User');
        this._authService
            .getMenu(USER)
            .pipe(
                map((response: any[]) => Helper.organizeMenu(response, true)),
                map((response: any) => Helper.buildMenu(response)),
                finalize(() => this._fuseSplashScreenService.hide())
            )
            .subscribe((data) => this._storageService.setNavigationMenu(data, true));
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
