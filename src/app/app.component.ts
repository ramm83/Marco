import {AfterViewInit, Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Platform} from '@angular/cdk/platform';
import {Subject} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';

import {FuseConfigService} from '@fuse/services/config.service';
import {FuseNavigationService} from '@fuse/components/navigation/navigation.service';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';
import {FuseSplashScreenService} from '@fuse/services/splash-screen.service';

import {navigation} from 'app/navigation/navigation';
import {MatDialog} from '@angular/material/dialog';
import {AuthenticationService} from '@core/services/authentication.service';
import {SettingsService} from '@core/services/settings.service';
import {Helper} from '@shared/common/helper';
import {fuseAnimations} from '@fuse/animations';
import {SessionExpiredComponent} from '@shared/components/session-expired/session-expired.component';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: fuseAnimations
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
    fuseConfig: any;
    navigation: any;
    intervalFunc: any;

    // inactivity
    timeoutnotificationInactivity: any;
    timeoutdueInactivity: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {Platform} _platform
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _platform: Platform,
        private _authService: AuthenticationService,
        private _dialog: MatDialog,
        private _settings: SettingsService
    ) {
        // Get default navigation
        this.navigation = navigation;

        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');

        if (sessionStorage.getItem('Token') && this._settings.isInternet) {
            this.intervalFunc = Helper.validateToken(this._authService, _dialog);
        }

        if (sessionStorage.getItem('Token')) {
            this.intervalFunc = Helper.validateToken(this._authService, _dialog);
        }

        // Add is-mobile class to the body if the platform is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;

                // Boxed
                if (this.fuseConfig.layout.width === 'boxed') {
                    this.document.body.classList.add('boxed');
                } else {
                    this.document.body.classList.remove('boxed');
                }

                // Color theme - Use normal for loop for IE11 compatibility
                for (let i = 0; i < this.document.body.classList.length; i++) {
                    const className = this.document.body.classList[i];

                    if (className.startsWith('theme-')) {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });

        if (sessionStorage.getItem('Token')) {
            if (this.timeoutnotificationInactivity && this.timeoutdueInactivity) {
                clearTimeout(this.timeoutnotificationInactivity);
                clearTimeout(this.timeoutdueInactivity);
            }
            this.createTimeout();
        }
        this._authService.isInactive.subscribe((active) => {
            if (this.timeoutnotificationInactivity && this.timeoutdueInactivity) {
                clearTimeout(this.timeoutnotificationInactivity);
                clearTimeout(this.timeoutdueInactivity);
            }

            if (this._authService.isNotificationInactiveEnabled.getValue()) {
                this.createTimeout();
            }
        });
    }

    ngAfterViewInit(): void {
        this._authService.isAuthenticated$.subscribe((value) => {
            if (value) {
                clearInterval(this.intervalFunc);
                this.intervalFunc = Helper.validateToken(
                    this._authService,
                    this._dialog
                );
            } else {
                clearInterval(this.intervalFunc);
                clearTimeout(this.timeoutnotificationInactivity);
                clearTimeout(this.timeoutdueInactivity);
            }
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

    // Inacticity

    @HostListener('document:click', ['$event'])
    documentClick(event: MouseEvent) {
        if (sessionStorage.getItem('Token') && this._authService.captureClick) {
            this._authService.nextIsInactive(true);
        }
    }

    private createTimeout() {
        this.timeoutnotificationInactivity = this.createtimeoutnotificationInactivity();
        this.timeoutdueInactivity = this.createtimeoutInactivity();
    }

    private createtimeoutInactivity() {
        return setTimeout(() => {
            //this._fuseSplashScreenService.show();
            this._authService
                .Logout()
                .pipe(
                    finalize(() => {
                        sessionStorage.clear();
                        this._authService.isAuthenticated$.next(false);
                        //this._fuseSplashScreenService.hide();
                        clearTimeout(this.timeoutnotificationInactivity);
                        clearTimeout(this.timeoutdueInactivity);
                        const data = {
                            type: 2,
                            text: 'Su sesión expiro por inactividad, inicie sesión nuevamente',
                            route: '/auth/login',
                            icon: 'alarm'
                        };
                        this._dialog.open(SessionExpiredComponent, {
                            disableClose: true,
                            width: '600px',
                            data: data,
                        });
                    })
                )
                .subscribe();
        }, this._settings.timeOfInactivity * 60 * 1000);

    }

    private createtimeoutnotificationInactivity() {
        return setTimeout(() => {
            const data = {
                type: 1,
                time: (this._settings.timeOfInactivity - this._settings.noficationTimeOfInactivity) * 60,
                route: '/auth/login',
                icon: 'alarm'
            };
            this._authService.captureClick = false;
            this._dialog.open(SessionExpiredComponent, {
                disableClose: true,
                width: '600px',
                data: data,
            });
        }, this._settings.noficationTimeOfInactivity * 60 * 1000);
    }
}
