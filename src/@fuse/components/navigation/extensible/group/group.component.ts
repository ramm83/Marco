import {
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { merge, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { FuseNavigationItem } from "@fuse/types";
import { FuseNavigationService } from "@fuse/components/navigation/navigation.service";
import { ExtensibleService } from "@fuse/services/extensible.service";
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

@Component({
    selector: "fuse-nav-extensible-group",
    templateUrl: "./group.component.html",
    styleUrls: ["./group.component.scss"],
})
export class FuseNavExtensibleGroupComponent implements OnInit, OnDestroy {
    @HostBinding("class")
    classes = "nav-group nav-item";

    @Input()
    item: FuseNavigationItem;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     */

    /**
     *
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {FuseNavigationService} _fuseNavigationService
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _extensibleService: ExtensibleService,
        private _fuseSidebarService: FuseSidebarService,
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

        this._extensibleService.onChangeGroupSelected.subscribe((result) => {
            this.item.classes =
                this.item.classes != null
                    ? this.item.classes.replace("active", "")
                    : this.item.classes;

            if (result.group == this.item) {
                this.item.classes =
                    this.item.classes != null
                        ? this.item.classes + "active"
                        : "active";
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

    showNavExtensible(group: any) {
        this._extensibleService.changeSelectedGroup(group);
        this._fuseSidebarService.getSidebar('navbar').toggleFold(group);
    }
}
