import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';

import {FuseSearchBarModule, FuseShortcutsModule} from '@fuse/components';
import {FuseSharedModule} from '@fuse/shared.module';
import {ToolbarComponent} from './toolbar.component';
import {SearchboxModule} from '../searchbox/searchbox.module';
import {MatBadgeModule} from '@angular/material/badge';
import {MdePopoverModule} from '@material-extended/mde';
import {MatCardModule} from '@angular/material/card';
import {PopoverUserComponent} from './popover-user/popover-user.component';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
    declarations: [ToolbarComponent, PopoverUserComponent],
    imports: [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule,
        SearchboxModule,
        MatBadgeModule,
        MatCardModule,
        MatTooltipModule,

        MdePopoverModule
    ],
    exports: [ToolbarComponent],
})
export class ToolbarModule {
}
