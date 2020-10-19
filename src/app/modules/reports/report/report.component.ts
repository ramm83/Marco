import {Component, EventEmitter, Inject, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ReportesService} from '@core/services/reportes.service';
import {FormControlService} from '@core/services/form-control.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ExcelService} from '@core/services/excel.service';
import {Helper} from '@shared/common/helper';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

import {FuseSplashScreenService} from '@fuse/services/splash-screen.service';
import {AuthenticationService} from '@core/services/authentication.service';
import {SglService} from '@core/services/sgl.service';
import {ConfEjecucionModel} from '@shared/models/Message.model';
import {SettingsService} from '@core/services/settings.service';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    providers: [FormControlService],
})
export class ReportComponent implements OnInit, OnDestroy, OnChanges {
    Valid = false;
    disabled = true;
    visible = false;
    columnDefs: any;
    rowData: any;
    descripcion: string;
    display = 'none';
    idInterno: number;
    idTarea: number;
    params: any;
    items: any;
    myForm: FormGroup;
    group: any = {};
    fileNameDialogRef: MatDialogRef<ReportDialogComponent>;
    private sub: any;

    constructor(
        public dialog: MatDialog,
        public reposteService: ReportesService,
        private qcs: FormControlService,
        private router: Router,
        private authService: AuthenticationService,
        private spinner: FuseSplashScreenService,
        private route: ActivatedRoute,
        private excelService: ExcelService,
        private sglService: SglService,
        private _snackBar: MatSnackBar,
        private _settings: SettingsService
    ) {
    }

    ngOnChanges(): void {
    }

    ngOnInit(): void {
        this.getUrlParams();
    }

    getUrlParams(): void {
        // Arreglar
        this.sub = this.route.params.subscribe((params) => {
            this.visible = false;
            this.columnDefs = [];
            this.rowData = [];
            this.params = Helper.decrypt(
                params.id.toString(),
                this._settings.getSecretKey
            ).split('-');
            this.idInterno = +this.params[4];
            this.descripcion = this.params[5];
            this.idTarea = this.params[6];
            this.appStart();
        });
    }

    appStart(): void {
        this.authService.getAutorizar().subscribe(
            (data) => {
                if (data) {
                    const parametros = {
                        Tag: 'PARSGLSQL',
                        Parametros: '#' + this.idInterno,
                        Separador: '#',
                    };
                    this.getParams(parametros, this.idInterno);
                }
            },
            (error) => {
                switch (error.status) {
                    case 401:
                        this.router.navigate(['/auth/login']);
                        break;
                    default:
                        this.router.navigate(['/auth/login']);
                        break;
                }
            }
        );
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    getParams(parametros: any, idInterno: number): void {
        this.spinner.show();
        this.reposteService.getParametros(parametros).subscribe(
            (data: any) => {
                if (data.Estado) {
                    this.myForm = this.qcs.toFormGroup(data.Value);
                    this.Valid = true;
                    this.items = data.Value;

                    const parameters = {
                        disableClose: true,
                        autoFocus: true,
                        data: {
                            idTarea: this.idTarea,
                            form: this.myForm,
                            items: this.items,
                            rowData: null,
                        },
                    };

                    const dialogConfig = new MatDialogConfig();
                    dialogConfig.disableClose = false;
                    dialogConfig.autoFocus = true;

                    this.fileNameDialogRef = this.dialog.open(
                        ReportDialogComponent,
                        parameters
                    );
                    this.spinner.hide();
                    this.fileNameDialogRef.afterClosed().subscribe((result) => {
                        if (result !== undefined) {
                            this.openSnackBar(
                                'Reporte registrado correctamente con ID = ' +
                                result
                            );
                        } else {
                            this.openSnackBar(
                                'No ha sido posible registrar el reporte'
                            );
                        }
                        this.spinner.hide();
                        this.router.navigate(['index']);
                        this.sglService.bhv_resetTimer.next(true);
                    });
                } else {
                    this.getData(this.idTarea);
                }
            },
            (error: any) => {
                console.log('error report');
            }
        );
    }

    // Ejecución sin parámetros
    getData(id: number): void {
        const formParams =
            '#' +
            sessionStorage.getItem('User') +
            '#' +
            sessionStorage.getItem('Key');
        const parametros = {
            IdSql: id,
            Parametros: formParams,
            Separador: '#',
        };
        this.spinner.show();
        const query = new ConfEjecucionModel();
        query.Transaccion = 'I';
        query.Parametros = formParams;
        query.IdTarea = id;
        query.Usuario = sessionStorage.getItem('User');

        this.sglService.sglTareaEjecucion(query).subscribe(
            (response) => {
                // Si se tiene respuesta correcta se redirige a index
                if (
                    response.Estado &&
                    response.Value.length > 0 &&
                    !(response.Value[0].ID && response.Value[0].ID == '-1')
                ) {
                    this.openSnackBar(
                        'Reporte registrado correctamente con ID = ' +
                        response.Value[0].ID
                    );
                } else {
                    this.openSnackBar(
                        'No ha sido posible registrar el reporte'
                    );
                }
                this.spinner.hide();
                this.router.navigate(['index']);
                this.sglService.bhv_resetTimer.next(true);
            },
            (error) => {
                console.log('Error al registrar la tarea');
            }
        );
    }

    hideModal(): void {
        this.fileNameDialogRef.close();
    }

    isValid(): boolean {
        if (this.myForm.status === 'VALID') {
            return true;
        }
        return false;
    }

    exportAsXLSX(): void {
        this.excelService.exportAsExcelFile(this.rowData, 'Reporte');
    }

    openSnackBar(message: string) {
        const config = new MatSnackBarConfig();
        config.duration = 3000;
        this._snackBar.open(message, 'ACEPTAR', config);
    }
}

@Component({
    selector: 'app-reportes-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: ['./report.component.scss'],
    providers: [FormControlService],
})
export class ReportDialogComponent implements OnInit {
    @Output() open: EventEmitter<any> = new EventEmitter();

    Valid = false;
    disabled = true;
    columnDefs: any;
    rowData: any;
    descripcion: string;
    display = 'none';
    idTarea: number;
    params: any;
    items: any;
    myForm: FormGroup;
    group: any = {};
    private sub: any;

    constructor(
        public dialogRef: MatDialogRef<ReportDialogComponent>,
        public reposteService: ReportesService,
        private qcs: FormControlService,
        private spinner: FuseSplashScreenService,
        private route: ActivatedRoute,
        private excelService: ExcelService,
        private sglService: SglService,
        private _setting: SettingsService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.rowData = '';
        this.idTarea = data.idTarea;
        this.myForm = data.form;
        this.items = data.items;
        this.Valid = true;
    }

    ngOnInit(): void {
    }

    // Insert con múltiples parámetros
    onSubmit = () => {
        if (this.myForm.status === 'VALID') {
            let formParams = '';
            if (this._setting.isInternet) {
                formParams =
                    '#' +
                    sessionStorage.getItem('User') +
                    '#' +
                    sessionStorage.getItem('Key');
            }


            Object.keys(this.myForm.controls).forEach((key) => {
                if (this.myForm.controls[key].value._isAMomentObject) {
                    formParams +=
                        '#' +
                        this.myForm.controls[key].value.format('DD/MM/YYYY');
                } else {
                    formParams += '#' + this.myForm.get(key).value;
                }
            });
            const parametros = {
                IdSql: this.idTarea,
                Parametros: formParams,
                Separador: '#',
            };
            this.spinner.show();
            const query = new ConfEjecucionModel();
            query.Transaccion = 'I';
            query.Parametros = formParams;
            query.IdTarea = this.idTarea;
            // query.P_HOST_EJECUCION = this.ipAddress;
            query.Usuario = sessionStorage.getItem('User');

            this.sglService.sglTareaEjecucion(query).subscribe(
                (response) => {
                    this.hideModal();
                    this.sglService.bhv_resetTimer.next(true);
                    if (
                        response.Estado &&
                        response.Value.length > 0 &&
                        !(response.Value[0].ID && response.Value[0].ID == '-1')
                    ) {
                        this.dialogRef.close(response.Value[0].ID);
                    } else {
                        this.dialogRef.close();
                    }
                },
                (error) => {
                    console.log('Error al registrar la tarea');
                }
            );
        }
    };

    hideModal(): void {
        this.dialogRef.close();
    }

    isValid(): boolean {
        if (this.myForm.status === 'VALID') {
            return true;
        }
        return false;
    }

    exportAsXLSX(): void {
        this.excelService.exportAsExcelFile(this.rowData, 'reporte');
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
