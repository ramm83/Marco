import {NgModule} from '@angular/core';
import {FuseSharedModule} from '@fuse/shared.module';

import {NavbarExtensibleComponent} from './navbar-extensible.component';
import {ExtensibleModule} from '@fuse/components/navigation/extensible/extensible.module';
import {FuseNavigationModule} from '@fuse/components';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
    declarations: [NavbarExtensibleComponent],
    imports: [
        FuseSharedModule,
        ExtensibleModule,
        FuseNavigationModule,
        CommonModule,
        RouterModule,
        MatIconModule,
        MatCheckboxModule
    ],
    exports: [NavbarExtensibleComponent],
})
export class NavbarExtensibleModule {
}
