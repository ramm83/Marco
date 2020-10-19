import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ReportViewerComponent} from './report-viewer/report-viewer.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatPaginatorModule} from '@angular/material/paginator';
import {ReportComponent, ReportDialogComponent} from './report/report.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TextComponent} from './forms/text/text.component';
import {NumberComponent} from './forms/number/number.component';
import {DropDownComponent} from './forms/drop-down/drop-down.component';
import {DatePickerComponent} from './forms/date-picker/date-picker.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';

const routes: Routes = [
    {path: ':id', pathMatch: 'full', component: ReportViewerComponent},
    {path: '', pathMatch: 'full', component: ReportComponent},
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FlexLayoutModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatTableModule,
        MatIconModule,
        MatDialogModule,
        MatPaginatorModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MatDatepickerModule,
        MatSelectModule
    ],
    exports: [RouterModule],
    declarations: [
        ReportViewerComponent,
        ReportComponent,
        ReportDialogComponent,
        TextComponent,
        NumberComponent,
        DropDownComponent,
        DatePickerComponent
    ],
    entryComponents: [ReportDialogComponent],
})
export class ReportsModule {
}
