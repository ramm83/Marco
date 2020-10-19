import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {IframeComponent} from './iframe.component';
import {SafePipePipe} from '@shared/pipes/safe-pipe.pipe';
import {IframeTrackerDirective} from './iframe-tracker-directive';

const routes: Routes = [
    {path: '', pathMatch: 'full', component: IframeComponent},
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: [SafePipePipe, IframeComponent, IframeTrackerDirective],
})
export class IframeModule {
}
