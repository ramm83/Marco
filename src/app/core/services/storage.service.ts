import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    private _navigationMenu$: Subject<any>;
    private _originalNavigateMenu: any;
    private _clearSearchBox = new BehaviorSubject<string>('');

    constructor() {
        this._navigationMenu$ = new Subject();
    }


    get originalNavigateMenu(): any {
        return this._originalNavigateMenu;
    }

    get clearSearchBox(): Observable<string> {
        return this._clearSearchBox.asObservable();
    }

    nextClearSearchBox(valor: string) {
        this._clearSearchBox.next(valor);
    }

    setNavigationMenu(dataMenu: any, firstTime: boolean) {
        if (firstTime) {
            this._originalNavigateMenu = JSON.parse(JSON.stringify(dataMenu));
        }
        this._navigationMenu$.next(dataMenu);
    }

    resetNavigationMenu() {
        this._navigationMenu$.next(this._originalNavigateMenu);
        if (this._originalNavigateMenu) {
            this._originalNavigateMenu = JSON.parse(JSON.stringify(this._originalNavigateMenu));
        }
    }

    getNavigationMenu() {
        return this._navigationMenu$.asObservable();
    }
}
