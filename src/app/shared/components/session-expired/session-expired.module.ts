import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {SessionExpiredComponent} from './session-expired.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {CountdownModule} from 'ngx-countdown';

@NgModule({
    declarations: [SessionExpiredComponent],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,

        CountdownModule
    ],
    exports: [SessionExpiredComponent],
})
export class SessionExpiredModule {
}
