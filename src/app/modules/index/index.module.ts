import {NgModule} from '@angular/core';
import {IndexComponent} from './index.component';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {CardAccessComponent} from './card-access/card-access.component';
import {CommonModule} from '@angular/common';

const routes: Routes = [
    {path: '', component: IndexComponent, pathMatch: 'full'},
];

@NgModule({
    declarations: [IndexComponent, CardAccessComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FlexLayoutModule,
        MatCardModule,
        MatIconModule],
    exports: [RouterModule],
})
export class IndexModule {
}
