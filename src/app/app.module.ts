import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {MatMomentDateModule} from '@angular/material-moment-adapter';

import {FuseModule} from '@fuse/fuse.module';
import {FuseSharedModule} from '@fuse/shared.module';
import {FuseProgressBarModule, FuseSidebarModule} from '@fuse/components';
import {fuseConfig} from 'app/fuse-config';
import {CoreModule} from '@core/core.module';
import {AppComponent} from './app.component';
import {AuthenticationGuard} from '@core/guards/authentication.guard';
import {SessionExpiredComponent} from '@shared/components/session-expired/session-expired.component';
import {SessionExpiredModule} from '@shared/components/session-expired/session-expired.module';
import {ReporteCargueComponent} from '@modules/load-massive/cm/cm.component';
import {LoadMassiveModule} from '@modules/load-massive/load-massive.module';

const appRoutes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'auth/login'},
    {
        path: 'auth',
        loadChildren: () =>
            import('@modules/login-2/login-2.module').then(
                (m) => m.Login2Module
            ),
    },
    {
        path: '',
        canLoad: [AuthenticationGuard],
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
            import('@modules/layout/layout-1.module').then(
                (m) => m.VerticalLayout1Module
            ),
    },
    {path: '**', redirectTo: '/index'},
];

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, {useHash: true}),
        // Material moment date module
        MatMomentDateModule,
        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSidebarModule,
        FuseSharedModule,
        // Custom Components
        CoreModule,
        SessionExpiredModule,
    ],
    entryComponents: [
        SessionExpiredComponent,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
