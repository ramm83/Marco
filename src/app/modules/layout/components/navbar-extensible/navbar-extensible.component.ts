import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ExtensibleService} from '@fuse/services/extensible.service';
import {InterfaceService} from '../../../../core/services/interface.service';
import {StorageService} from '../../../../core/services/storage.service';

@Component({
    selector: 'navbar-extensible',
    templateUrl: './navbar-extensible.component.html',
    styleUrls: ['./navbar-extensible.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarExtensibleComponent implements OnInit {

    viewmodel: any;
    show = false;
    searchboxText = undefined;

    constructor(
        private _extensibleService: ExtensibleService,
        private _interfaceService: InterfaceService,
        private _storageService: StorageService,
    ) {
    }

    ngOnInit() {
        this._extensibleService.onChangeGroupSelected.subscribe(result => {
            if (result != null) {
                this.viewmodel = result.group;
            }
        });

        this.searchboxText = this._storageService.clearSearchBox;
    }

    toggleExpand() {
        this._interfaceService.toggleExpandAll();
    }

    clearFilter() {
        this._storageService.nextClearSearchBox('');
        this._extensibleService.changeSelectedGroup(undefined);
    }
}
