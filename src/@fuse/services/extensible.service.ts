import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ExtensibleService {

    @Output()
    onChangeGroupSelected = new EventEmitter<{ group: any }>();

    changeSelectedGroup(group: any) {
        this.onChangeGroupSelected.emit({
            group
        });
    }
}