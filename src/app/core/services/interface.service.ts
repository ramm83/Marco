import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InterfaceService {

    expandAll = new BehaviorSubject<boolean>(false);
    showOptionsSearchBox = new BehaviorSubject<boolean>(false);

    constructor() {
    }

    toggleExpandAll() {
        this.expandAll.next(!this.expandAll.getValue());
    }

    getExpandAll() {
        return this.expandAll;
    }

    toggleShowOptionsSearchBox(show: boolean) {
        this.showOptionsSearchBox.next(show);
    }

    getShowOptionsSearchBox() {
        return this.showOptionsSearchBox;
    }
}
