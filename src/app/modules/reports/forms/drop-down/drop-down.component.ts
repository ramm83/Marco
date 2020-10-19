import {ReportesService} from '@core/services/reportes.service';
import {NgSelectConfig} from '@ng-select/ng-select';
import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';


@Component({
    selector: 'app-drop-down',
    templateUrl: './drop-down.component.html',
    styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent implements OnInit {

    @Input() cmb: any;
    @Input() form: FormGroup;
    lkp: Array<any> = [];

    constructor(public reposteService: ReportesService,
                private config: NgSelectConfig) {
        this.config.notFoundText = 'No se encontraron datos';
    }

    ngOnInit(): void {
        this.getDatos(this.cmb.ID_SQL_CURSOR);
    }

    getDatos(id: number): any {
        this.reposteService.getDatos(id)
            .subscribe(
                (data: any) => {
                    if (data.Estado) {
                        this.lkp = data.Value;
                    } else {
                        console.log('La consulta no retorno datos');
                    }
                }, (error: any) => {
                    console.log('error drop');
                }
            );
    }

}
