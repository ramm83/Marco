import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Injectable()
export class FormControlService {
    constructor() {
    }

    toFormGroup(fields: any[]): any {
        const group: any = {};

        fields.forEach((field) => {
            group[field.NOMBRE] = new FormControl(
                undefined,
                Validators.required
            );
        });
        return new FormGroup(group);
    }
}
