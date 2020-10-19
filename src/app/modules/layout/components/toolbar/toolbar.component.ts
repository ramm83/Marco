import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {FuseConfigService} from '@fuse/services/config.service';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';

import {navigation} from 'app/navigation/navigation';
import {AuthenticationService} from '@core/services/authentication.service';
import {Router} from '@angular/router';
import {LoggedUser} from '@shared/interfaces/user';
import {SglService} from '../../../../core/services/sgl.service';
import {MdePopoverTrigger} from '@material-extended/mde';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ToolbarComponent implements OnInit, OnDestroy {
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    navigation: any;
    user: LoggedUser;
    // Controlador de cuentas
    cantidad = 0;
    @ViewChild(MdePopoverTrigger) trigger: MdePopoverTrigger;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _authService: AuthenticationService,
        private sglService: SglService,
        private _router: Router
    ) {
        this.navigation = navigation;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    someMethod() {
        this.trigger.togglePopover();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loadUserInfo();
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar =
                    settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        this.sglService.bhv_newMessages.subscribe(
            value => {
                this.cantidad = value;
            }
        );
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        if (key !== 'navbar') {
            this .sglService.bhv_newMessages.next(0);
        }
        this._fuseSidebarService.getSidebar(key).open();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getInitials() {
        const FIRST_LETTER = this.user?.NOMBRES?.charAt(0);
        const SECOND_LETTER = this.user?.APELLIDOS?.charAt(0);
        return FIRST_LETTER + SECOND_LETTER;
    }

    private loadUserInfo() {
        const USER = sessionStorage.getItem('User');
        this._authService.getUserInfo(USER).subscribe((data: LoggedUser[]) => {
            if (data && data.length > 0) {
                this.user = data[0];
                sessionStorage.setItem('Key', this.user.VPC_TECH_KEY.toString());
            } else {
                this._router.navigate(['login']);
            }
        });
    }
}
