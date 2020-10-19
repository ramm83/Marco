import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Filter} from './filter';
import {FuseNavigation} from '@fuse/types';
import {Router} from '@angular/router';
import {AuthenticationService} from '@core/services/authentication.service';
import {StorageService} from '@core/services/storage.service';
import {InterfaceService} from '../../../../core/services/interface.service';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import * as _ from 'lodash';

@Component({
    selector: 'searchbox',
    templateUrl: './searchbox.component.html',
    styleUrls: ['./searchbox.component.scss']
})
export class SearchboxComponent implements OnInit, AfterViewInit {

    @ViewChild('idAutocomplete', {read: MatAutocompleteTrigger}) autocomplete: MatAutocompleteTrigger;
    public searchMessage = '¿Qué buscas?';
    public filteredData: any;
    public toSearch: string;
    private data: FuseNavigation[];

    constructor(
        private router: Router,
        private _authService: AuthenticationService,
        private _storageService: StorageService,
        private _interfaceService: InterfaceService
    ) {
        this.loadMenu();
    }

    ngOnInit(): void {
        this._storageService.clearSearchBox.subscribe(data => {
            if (data === '') {
                this.clearInput();
            }
        });
    }

    ngAfterViewInit(): void {
        this._interfaceService.getShowOptionsSearchBox().subscribe(show => {
            if (!show) {
                this.autocomplete.closePanel();
            }
        });
    }

    public changeInput(event: any): void {
        if (event) {
            if (event.length >= 2) {
                this._storageService.nextClearSearchBox(event);
                const arrayComplete = JSON.parse(JSON.stringify(this._storageService.originalNavigateMenu));
                this.filteredData = Filter.SetFilteredData(event, arrayComplete);
                let lastArray = JSON.parse(JSON.stringify(arrayComplete)).map(element => {
                    element.children = [];
                    return element;
                });
                lastArray = _.unionBy(this.filteredData, lastArray, 'title');
                this._storageService.setNavigationMenu(lastArray, false);
            }
        } else {
            this._storageService.resetNavigationMenu();
            this.filteredData = [];
        }
    }

    public clearInput(): void {
        this.toSearch = '';
        this._storageService.resetNavigationMenu();
        this.filteredData = [];
    }

    public navegar(item: any): void {
        this._authService.percistAccess(item.id_tarea);
        this.router.navigate([item.url]);
    }

    private loadMenu(): void {
        this._storageService
            .getNavigationMenu()
            .subscribe((data: FuseNavigation[]) => {
                this.data = data;
            });
    }
}
