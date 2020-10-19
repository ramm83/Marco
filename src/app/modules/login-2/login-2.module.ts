import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {FuseSharedModule} from '@fuse/shared.module';

import {Login2Component} from './login-2.component';

const routes: Routes = [
    {
        path: 'login',
        component: Login2Component,
    },
    {path: '', pathMatch: 'full', redirectTo: 'login'},
];

@NgModule({
    declarations: [Login2Component],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FuseSharedModule,
    ],
})
export class Login2Module {
}
