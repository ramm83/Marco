import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FuseSplashScreenService} from '@fuse/services/splash-screen.service';
import {finalize} from 'rxjs/operators';
import {Helper} from '@shared/common/helper';
import {Cargue} from '@shared/models/CM.model';

import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

import {CarguemasivoService} from '@core/services/carguemasivo.service';
import {ExcelService} from '@core/services/excel.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

@Component({
    selector: 'app-cm-viewer',
    templateUrl: './cm-viewer.component.html',
    styleUrls: ['./cm-viewer.component.scss'],
})
export class CmViewerComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    //Datos del cargue masivo
    @Input() idCM: any;
    @Input() idTipoCM: any;
    nameCM = '';

    displayedColumns: string[] = [];
    columnDefs: any[] = [];
    data = [];
    dataSource: any;

    visible = false;
    noData = false;

    constructor(
        private route: ActivatedRoute,
        private spinner: FuseSplashScreenService,
        private excelService: ExcelService,
        private router: Router,
        public dialog: MatDialog,
        public cmService: CarguemasivoService,
        private _snackBar: MatSnackBar
    ) {
    }

    ngOnInit() {
        if (this.idCM && this.idTipoCM) {
            this.searchCM();
        } else {
            this.route.params.subscribe((params) => {
                if (params['id'] != null) {
                    let id = params['id'];
                    let allParams = atob(id);
                    let listParams = allParams.split('#');
                    if (listParams.length > 0) {
                        this.nameCM = listParams[0];
                        this.idCM = listParams[1];
                        this.idTipoCM = listParams[4];
                        this.searchCM();
                    } else {
                        this.router.navigate(['/auth/login']);
                    }
                }
            });
        }
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    exportAsXLSX(): void {
        this.excelService.exportAsExcelFile(this.data, 'Reporte');
    }

    searchCM() {
        this.spinner.show();
        const datas: Cargue = {
            IdTipoCM: this.idTipoCM,
            IdCargue: this.idCM,
        };

        this.cmService
            .GetReporteInfo(datas)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(
                (data: any) => {
                    if (!data.Estado) {
                        this.noData = true;
                        this.visible = false;
                    } else {
                        this.columnDefs = Helper.columnDefs(data.Value[0]);
                        this.displayedColumns = Helper.displayedColumns(
                            data.Value[0]
                        );
                        this.data = data.Value;
                        this.dataSource = new MatTableDataSource(
                            this.data || []
                        );
                        this.dataSource.paginator = this.paginator;
                        this.visible = true;
                        this.noData = false;
                    }
                },
                (error: any) => {
                    this.spinner.hide();
                    this.openSnackBar(
                        'No ha sido posible consultar la información del reporte'
                    );
                    this.router.navigate(['/Index']);
                }
            );
    }

    openSnackBar(message: string) {
        let config = new MatSnackBarConfig();
        config.duration = 3000;
        this._snackBar.open(message, 'ACEPTAR', config);
    }
}
