import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import {FuseNavigationModule} from '@fuse/components';
import {FuseSharedModule} from '@fuse/shared.module';

import {NavbarVerticalStyle2Component} from './style-2.component';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [NavbarVerticalStyle2Component],
    imports: [
        MatButtonModule,
        MatIconModule,
        FuseSharedModule,
        FuseNavigationModule,
        RouterModule,
    ],
    exports: [NavbarVerticalStyle2Component],
})
export class NavbarVerticalStyle2Module {
}
