import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { StorageService } from '@core/services/storage.service';
import { FuseNavigation } from '@fuse/types';
import { SettingsService } from '@core/services/settings.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { Router } from '@angular/router';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';

@Component({
    selector: 'fuse-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuseNavigationComponent implements OnInit, AfterViewInit {
    @Input()
    navigation: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     *
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {FuseNavigationService} _fuseNavigationService
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _storageService: StorageService,
        private _settings: SettingsService,
        private _authService: AuthenticationService,
        private router: Router
    ) {
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
        // Load the navigation either from the input or from the service
        this._loadMenu();


    }

    ngAfterViewInit(): void {
        // Subscribe to the current navigation changes
        this._fuseNavigationService.onNavigationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                // Load the navigation
                this.navigation = this._fuseNavigationService.getCurrentNavigation();

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to navigation item
        merge(
            this._fuseNavigationService.onNavigationItemAdded,
            this._fuseNavigationService.onNavigationItemUpdated,
            this._fuseNavigationService.onNavigationItemRemoved
        )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
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

    private _loadMenu(): void {
        this._storageService
            .getNavigationMenu()
            .subscribe((data: FuseNavigation[]) => {
                this.navigation = data;
                if (!this._settings.isInternet) {
                    sessionStorage.setItem(
                        'configuracion',
                        btoa(JSON.stringify(data))
                    );
                }
                this._changeDetectorRef.markForCheck();
            });
    }

}
