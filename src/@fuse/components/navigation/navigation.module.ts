import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatRippleModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

import { TranslateModule } from "@ngx-translate/core";

import { FuseNavigationComponent } from "./navigation.component";
import { FuseNavVerticalItemComponent } from "./vertical/item/item.component";
import { FuseNavVerticalCollapsableComponent } from "./vertical/collapsable/collapsable.component";
import { FuseNavVerticalGroupComponent } from "./vertical/group/group.component";

import { ExtensibleModule } from "./extensible/extensible.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        MatRippleModule,
        MatButtonModule,
        TranslateModule.forChild(),
        ExtensibleModule,
        MatTooltipModule,
        FlexLayoutModule,
    ],
    exports: [
        FuseNavigationComponent,
        FuseNavVerticalCollapsableComponent,
        FuseNavVerticalItemComponent,
    ],
    declarations: [
        FuseNavigationComponent,
        FuseNavVerticalGroupComponent,
        FuseNavVerticalItemComponent,
        FuseNavVerticalCollapsableComponent,
    ],
})
export class FuseNavigationModule {}
