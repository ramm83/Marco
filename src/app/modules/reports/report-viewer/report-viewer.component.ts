import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ReportesService} from '@core/services/reportes.service';
import {finalize} from 'rxjs/operators';
import {FuseSplashScreenService} from '@fuse/services/splash-screen.service';
import {Helper} from '@shared/common/helper';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {ExcelService} from '@core/services/excel.service';

@Component({
    selector: 'app-report-viewer',
    templateUrl: './report-viewer.component.html',
    styleUrls: ['./report-viewer.component.scss'],
})
export class ReportViewerComponent implements OnInit {
    displayedColumns: string[] = [];
    columnDefs: any[] = [];
    data = [];
    dataSource: any;

    //Datos del reporte
    idReporte;
    nameReporte = '';

    visible = false;
    noData = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private route: ActivatedRoute,
        private reporteService: ReportesService,
        private spinner: FuseSplashScreenService,
        private excelService: ExcelService,
        private router: Router,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            if (params['id'] != null) {
                let id = params['id'];
                let allParams = atob(id);
                let listParams = allParams.split('#');

                if (listParams.length > 0) {
                    this.nameReporte = listParams[0];
                    this.idReporte = listParams[1];
                    this.searchReport();
                } else {
                    this.router.navigate(['/auth/login']);
                }
            }
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    exportAsXLSX(): void {
        this.excelService.exportAsExcelFile(this.data, 'Reporte');
    }

    searchReport() {
        this.spinner.show();
        this.visible = false;
        this.reporteService
            .getReporteBackgroundbyId(this.idReporte)
            .pipe(finalize(() => {
            }))
            .subscribe(
                (data: any) => {
                    this.spinner.show();
                    if (data.Estado && data.Value.length > 0) {
                        this.columnDefs = Helper.columnDefs(data.Value[0]);
                        this.displayedColumns = Helper.displayedColumns(
                            data.Value[0]
                        );
                        this.data = data.Value;
                        this.dataSource = new MatTableDataSource();
                        this.dataSource.data = data.Value;
                        this.visible = true;
                        this.noData = false;
                        setTimeout(() => {
                            this.dataSource.paginator = this.paginator;
                            this.spinner.hide();
                        }, 0);
                    } else {
                        this.noData = true;
                        this.visible = false;
                    }
                    this.spinner.hide();
                },
                (error: any) => {
                    this.spinner.hide();
                    this.openSnackBar(
                        'No ha sido posible consultar la información del reporte'
                    );
                    this.router.navigate(['Index']);
                }
            );
    }

    openSnackBar(message: string) {
        let config = new MatSnackBarConfig();
        config.duration = 3000;
        this._snackBar.open(message, 'ACEPTAR', config);
    }
}
