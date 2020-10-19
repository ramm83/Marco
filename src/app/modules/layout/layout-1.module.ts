import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {FuseProgressBarModule, FuseSidebarModule} from '@fuse/components';
import {FuseSharedModule} from '@fuse/shared.module';

import {ContentModule} from './components/content/content.module';
import {NavbarModule} from './components/navbar/navbar.module';
import {QuickPanelModule} from './components/quick-panel/quick-panel.module';
import {ToolbarModule} from './components/toolbar/toolbar.module';
import {NavbarExtensibleModule} from './components/navbar-extensible/navbar-extensible.module';

import {VerticalLayout1Component} from './layout-1.component';

const routes: Routes = [
    {
        path: '',
        component: VerticalLayout1Component,
        children: [
            {
                path: 'index',
                loadChildren: () =>
                    import('@modules/index/index.module').then(
                        (m) => m.IndexModule
                    ),
            },
            {
                path: 'cm/:id',
                loadChildren: () =>
                    import('@modules/load-massive/load-massive.module').then(
                        (m) => m.LoadMassiveModule
                    ),
            },
            {
                path: 'cmvw',
                loadChildren: () =>
                    import('@modules/load-massive/load-massive.module').then(
                        (m) => m.LoadMassiveModule
                    ),
            },
            {
                path: 'reportes/:id',
                loadChildren: () =>
                    import('@modules/reports/reports.module').then(
                        (m) => m.ReportsModule
                    ),
            },
            {
                path: 'reportesvw',
                loadChildren: () =>
                    import('@modules/reports/reports.module').then(
                        (m) => m.ReportsModule
                    ),
            },
            {
                path: 'iframe/:id',
                loadChildren: () =>
                    import('@modules/iframe/iframe.module').then(
                        (m) => m.IframeModule
                    ),
            },
        ],
    },
];

@NgModule({
    declarations: [VerticalLayout1Component],
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule,
        FuseSidebarModule,
        FuseProgressBarModule,
        ContentModule,
        NavbarModule,
        QuickPanelModule,
        ToolbarModule,
        NavbarExtensibleModule,
    ],
    exports: [VerticalLayout1Component],
})
export class VerticalLayout1Module {
}
