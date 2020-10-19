import {Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild,} from '@angular/core';
import {CargueGrafico, CargueMasivo} from '@shared/models/CM.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Angular2Txt} from 'angular2-txt/Angular2-txt';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef,} from '@angular/material/dialog';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

import {CarguemasivoService} from '@core/services/carguemasivo.service';
import {ExcelService} from '@core/services/excel.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

import {finalize} from 'rxjs/operators';
import {Helper} from '@shared/common/helper';
import {FuseSplashScreenService} from '@fuse/services/splash-screen.service';
import {ReportesService} from '@core/services/reportes.service';
import * as XLSX from 'xlsx';
import {AuthenticationService} from '@core/services/authentication.service';
import {SglService} from '@core/services/sgl.service';
import {ConfEjecucionModel} from '@shared/models/Message.model';
import {SettingsService} from '@core/services/settings.service';

@Component({
    selector: 'app-cm',
    templateUrl: './cm.component.html',
    styleUrls: ['./cm.component.scss'],
})
export class CmComponent implements OnInit {
    @ViewChild('fileInput') inputFile: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Output() convert = new EventEmitter<any>();
    params = [];
    idCargue: any;
    idTarea: number;
    idEjecucionTarea: number = 0;
    idCargueInterno: any;
    IdCargue: any;
    descripcion: any;
    data: any;
    csvContent: string;
    parsedCsv: string[][];
    CM: CargueMasivo;
    usuario: string;
    LstLineas: Array<any> = [];
    fileExcel: any;
    readonly extensions = {
        excel2003: 'application/vnd.ms-excel',
        excel2007:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    botonExportar = true;
    resultJSON: { headers: any; json: any[] };
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[];
    columnDefs: any[];
    isThereData: boolean = false;
    private sub: any;

    constructor(
        private _spinnerService: FuseSplashScreenService,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthenticationService,
        public cmService: CarguemasivoService,
        private rptService: ReportesService,
        private excelService: ExcelService,
        public dialog: MatDialog,
        public sglService: SglService,
        private _snackBar: MatSnackBar,
        private _settings: SettingsService
    ) {
    }

    ngOnInit(): void {
        this.getUrlParams();
    }

    getUrlParams(): void {
        this.sub = this.route.params.subscribe((params) => {
            this.usuario = sessionStorage.getItem('User');
            this.params = Helper.decrypt(
                params.id.toString(),
                this._settings.getSecretKey
            ).split('-');
            // tslint:disable-next-line:radix
            this.idCargue = parseInt(this.params[3]);
            // tslint:disable-next-line:radix
            this.idCargueInterno = parseInt(this.params[4]);
            this.descripcion = this.params[5];
            this.idTarea = this.params[6];
            this.authService.getAutorizar().subscribe(
                (data: any) => {
                    if (data) {
                        this.obtenerInformacionReporte();
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
        });
    }

    obtenerInformacionReporte(): void {
        this._spinnerService.show();
        const parametros = `#${this.usuario}#${this.idCargueInterno}`;
        this.cmService
            .GetInfoReporte(parametros)
            .pipe(
                finalize(() => {
                    this._spinnerService.hide();
                })
            )
            .subscribe((data: any) => {
                if (data['Value'].length === 0 || data['Value'][0]['Código']) {
                    this.openSnackBar('No se pudo cargar la información');
                    this.isThereData = false;
                } else {
                    this.isThereData = true;
                    const newColumn = [
                        {headerName: 'ACCIONES', field: 'ACCIONES'},
                    ];
                    this.columnDefs = Helper.columnDefs(data.Value[0]).concat(
                        newColumn
                    );
                    this.displayedColumns = Helper.displayedColumns(
                        data.Value[0]
                    ).concat(['ACCIONES']);
                    this.data = data.Value;
                    this.dataSource = new MatTableDataSource(this.data);
                    this.dataSource.paginator = this.paginator;
                }
            });
    }

    onFileLoad = (fileLoadedEvent: any) => {
        const csvSeparator = ';';
        const textFromFileLoaded = fileLoadedEvent.target.result;
        this.csvContent = textFromFileLoaded;

        const txt = textFromFileLoaded;
        const csv = [];
        let csv1 = [];
        const lines = txt.split('\n');

        lines.forEach((element) => {
            const cols: string[] = element.split();
            const elementos: string[] = cols[0].split(';');

            if (elementos.length > 1) {
                csv.push(elementos);
            }
        });

        this.parsedCsv = csv;
        csv1 = csv.splice(0, 1);
        csv.forEach((row) => {
            let output = '';
            let colNo = 0;
            row.forEach((col) => {
                if (colNo > 0) {
                    output += ';';
                }
                output += unescape(col);
                colNo++;
            });
            this.LstLineas.push(output);
        });
        this.cargueMasivoObtener(csv.length, this.LstLineas);
    };

    OnFileLoadExcel = () => {
        try {
            let Cargue = [];
            this.resultJSON.json.forEach((item) => {
                let objeto = '';
                Object.values(item).forEach((element) => {
                    objeto += element.toString() + ';';
                });
                Cargue.push(objeto.toString().substring(0, objeto.length - 1));
            });
            if (Cargue.length > 0) {
                this.cargueMasivoObtener(Cargue.length, Cargue);
            }
        } catch (error) {
        }
    };

    onFileSelect = (input: HTMLInputElement) => {
        const files = input.files;
        const content = this.csvContent;
        const self = this;
        if (files && files.length) {
            const fileToRead = files[0];
            this.fileExcel = files[0];
            const fileReader = new FileReader();
            if (
                fileToRead.type == this.extensions.excel2007 ||
                fileToRead.type == this.extensions.excel2003
            ) {
                fileReader.onload = function(
                    e: ProgressEvent
                ) {
                    self.resultJSON = self.convertToArray(e?.target['result']);
                    self.convert.next(self.resultJSON);
                    self.OnFileLoadExcel();
                };
                fileReader.readAsBinaryString(fileToRead);
            } else {
                fileReader.onload = this.onFileLoad;
                fileReader.readAsText(fileToRead, 'UTF-8');
            }
        }
        this.inputFile.nativeElement.value = null;
    };

    cargueMasivoObtener = (numerolineas: any, cargueMasivo: any) => {
        this._spinnerService.show();
        this.CM = {
            IdTipoCM: this.idCargueInterno,
            CantidadLineas: numerolineas,
            LstLineas: cargueMasivo,
            Usuario: this.usuario,
        };

        //Nuevo objeto
        let query = new ConfEjecucionModel();
        query.Transaccion = 'ICM';
        query.IdTarea = this.idTarea;
        query.Parametros = '';
        query.Usuario = this.usuario;
        query.LstLineas = cargueMasivo;

        this.sglService.sglTareaEjecucion(query).subscribe(
            (response) => {
                //Si se tiene respuesta correcta se redirige a index
                if (
                    response.Estado &&
                    response.Value.length > 0 &&
                    !(response.Value[0].ID && response.Value[0].ID == '-1')
                ) {
                    this.openSnackBar(
                        'Cargue masivo registrado correctamente con ID = ' +
                        response.Value[0].ID
                    );
                } else {
                    this.openSnackBar(
                        'No ha sido posible registrar el cargue masivo'
                    );
                }
                this._spinnerService.hide();
                this.router.navigate(['Index']);
                this.sglService.bhv_resetTimer.next(true);
            },
            (error) => {
                this.openSnackBar(
                    'Se ha presentado un error al registrar el cargue'
                );
            }
        );
    };

    exportDatatable0 = () => {
        this.excelService.exportAsExcelFile(
            this.data,
            'Reporte' + this.descripcion + '-' + this.usuario
        );
    };

    exportPlantillaXlsx(): any {
        const parametros = {
            Tag: 'CMINFCAMPO',
            Parametros: '#' + this.idCargueInterno,
            Separador: '#',
        };
        this.rptService
            .getParametros(parametros)
            .pipe(finalize(() => {
            }))
            .subscribe((data: any) => {
                if (data.Estado) {
                    let transform = Object.values(data.Value).map((e) =>
                        Object.values(e)
                    );
                    transform = transform[0].map((_, colIndex) =>
                        transform.map((row) => row[colIndex])
                    );
                    this.excelService.exportAsExcelFileCM(
                        transform,
                        'Plantilla_' + this.descripcion
                    );
                }
            });
    }

    exportPlantilla(): any {
        const parametros = {
            Tag: 'CMINFCAMPO',
            Parametros: '#' + this.idCargueInterno,
            Separador: '#',
        };
        this.rptService
            .getParametros(parametros)
            .pipe(finalize(() => {
            }))
            .subscribe((data: any) => {
                if (data.Estado) {
                    const options = {
                        fieldSeparator: ';',
                        quoteStrings: '"',
                        decimalseparator: '.',
                        showTitle: false,
                        useBom: true,
                    };
                    const filename = 'Plantilla_' + this.descripcion;
                    let transform = Object.values(data.Value).map((e) =>
                        Object.values(e)
                    );
                    transform = transform[0].map((_, colIndex) =>
                        transform.map((row) => row[colIndex])
                    );
                    const txt = new Angular2Txt(transform, filename, options);
                }
            });
    }

    viewDetails(element): void {
        this.IdCargue = parseInt(element.CARGUE);
        this.idEjecucionTarea = parseInt(element.ID_EJECUCION_TAREA);
        this.openDialog();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(ReporteCargueComponent, {
            width: '1250px',
            data: {
                IdTipoCM: this.idCargueInterno,
                IdCargue: this.IdCargue,
                Descripcion: this.descripcion,
            },
        });
    }

    openSnackBar(message: string) {
        let config = new MatSnackBarConfig();
        config.duration = 3000;
        this._snackBar.open(message, 'ACEPTAR', config);
    }

    private convertToArray(data: string): any {
        const wb: XLSX.WorkBook = XLSX.read(data, {type: 'binary'});

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        let result = XLSX.utils.sheet_to_json(ws);

        let json = XLSX.utils.sheet_to_json(ws, {defval: ''});
        let headers = XLSX.utils.sheet_to_json(ws, {header: 1, raw: true})[0];

        return {headers: headers, json: json};
    }
}

@Component({
    selector: 'app-reporte-cargue',
    templateUrl: './reporte.component.html',
    styleUrls: ['./cm.component.scss'],
})
export class ReporteCargueComponent {
    public IdCargue: number;
    public IdTipoCM: number;

    constructor(
        public dialogRef: MatDialogRef<ReporteCargueComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CargueGrafico
    ) {
        this.IdCargue = data.IdCargue;
        this.IdTipoCM = data.IdTipoCM;
    }

    Cerrar(): void {
        this.dialogRef.close();
    }
}
