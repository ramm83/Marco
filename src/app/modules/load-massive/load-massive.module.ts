import {NgModule} from '@angular/core';
import {CmComponent, ReporteCargueComponent} from './cm/cm.component';
import {CmViewerComponent} from './cm-viewer/cm-viewer.component';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatPaginatorModule} from '@angular/material/paginator';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

const routes: Routes = [
    {path: ':id', pathMatch: 'full', component: CmViewerComponent},
    {path: '', pathMatch: 'full', component: CmComponent},
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FlexLayoutModule,
        MatButtonModule,
        MatFormFieldModule,
        MatTableModule,
        MatIconModule,
        MatDialogModule,
        MatPaginatorModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule
    ],
    exports: [RouterModule],
    declarations: [CmComponent, CmViewerComponent, ReporteCargueComponent],
    entryComponents: [ReporteCargueComponent],
})
export class LoadMassiveModule {
}
