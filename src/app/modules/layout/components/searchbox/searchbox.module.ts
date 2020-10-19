import {NgModule} from '@angular/core';
import {SearchboxComponent} from './searchbox.component';
import {RouterModule} from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {FuseSharedModule} from '@fuse/shared.module';
import {ExtensibleModule} from '@fuse/components/navigation/extensible/extensible.module';

@NgModule({
    declarations: [SearchboxComponent],
    imports: [
        RouterModule,
        FuseSharedModule,
        ExtensibleModule,
        MatInputModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
    ],
    exports: [SearchboxComponent],
})
export class SearchboxModule {
}
