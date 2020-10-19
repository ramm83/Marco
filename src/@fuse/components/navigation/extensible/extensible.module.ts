import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { FuseNavExtensibleGroupComponent } from './group/group.component';
import { FuseNavExtensibleCollapsableComponent } from './collapsable/collapsable.component';
import { FuseNavExtensibleItemComponent } from './item/item.component';
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
    declarations: [
        FuseNavExtensibleGroupComponent,
        FuseNavExtensibleItemComponent,
        FuseNavExtensibleCollapsableComponent
    ],
    imports     : [
        CommonModule,
        RouterModule,
        MatIconModule,
        MatTooltipModule
    ],
    exports     : [
        FuseNavExtensibleGroupComponent,
        FuseNavExtensibleItemComponent,
        FuseNavExtensibleCollapsableComponent
    ]
})
export class ExtensibleModule
{
}