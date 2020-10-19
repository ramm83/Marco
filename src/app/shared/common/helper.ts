import * as CryptoJS from 'crypto-js';
import {SessionExpiredComponent} from '@shared/components/session-expired/session-expired.component';
import * as _ from 'lodash';

export class Helper {
    static columnDefs(json): any {
        const cols = Object.keys(json);
        const columnDefs: Array<any> = [];
        cols.forEach((col) => {
            const estruct = {
                headerName: this.replaceALL(col, '_', ' '),
                field: col,
            };
            columnDefs.push(estruct);
        });
        return columnDefs;
    }

    static displayedColumns(json): any {
        const cols = Object.keys(json);
        const columns: Array<any> = [];
        cols.forEach((col) => {
            columns.push(col);
        });
        return columns;
    }

    static encrypt(text: string, secretKey: string = ''): any {
        const encrypt = CryptoJS.AES.encrypt(text, secretKey);
        return btoa(encrypt.toString());
    }

    static decrypt(text: string, secretKey: string = ''): any {
        const decrypted = CryptoJS.AES.decrypt(atob(text), secretKey);
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    static validateToken(_authService, dialog): any {
        const data = {
            type: 0,
            text: 'Ha ocurrido un error, inicie sesión nuevamente',
            route: '/auth/login',
            icon: 'notification_important'
        };
        const intervalFunc = setInterval(() => {
            _authService
                .getAutorizar()
                .toPromise()
                .catch((error) => {
                    if (error.status === 401) {
                        data['text'] =
                            'Su sesión ha expirado! Por favor inicie sesión nuevamente.';
                    }
                    clearInterval(intervalFunc);
                    const dialogRef = dialog.open(SessionExpiredComponent, {
                        disableClose: true,
                        width: '500px',
                        data: data,
                    });

                });
        }, 1000 * 180);
        return intervalFunc;
    }

    /**
     * Summary. (Se encarga de armar el menú en los tres tipos
     * de grupos existentes: Reportes, Carga Masiva y Aplicaciones)
     *
     * @access public
     * @param {any[]}   dataMenu        Respuesta del Servicio que retorna el menú
     *
     * @return {Object} Return value description.
     */
    static organizeMenu(dataMenu: any[], organizar: boolean = false) {
        let groups = {Aplicaciones: {}, 'Cargues Masivos': {}, Reportes: {}};
        dataMenu.forEach((firstLevel) => {
            firstLevel.children.forEach((secondLevel) => {
                secondLevel.children.forEach((thirdLevel) => {
                    if (thirdLevel.type === 'item') {
                        thirdLevel.badge = {
                            bg: thirdLevel.color_label,
                            fg: thirdLevel.color_texto_label,
                            title: thirdLevel.label_resaltado,
                        };
                    }
                });
                if (organizar) {
                    groups = this.setMenu(
                        {...groups},
                        {...firstLevel},
                        {...secondLevel}
                    );
                }
            });
        });
        return groups;
    }

    public static buildMenu(data: Object) {
        let menu = [];
        const applications = _.values(data['Aplicaciones']);
        const reports = _.values(data['Reportes']);
        const cm = _.values(data['Cargues Masivos']);
        menu.push(this.buildStructure(applications, 'Aplicaciones', 'apps'));
        menu.push(this.buildStructure(cm, 'Cargues Masivos', 'backup'));
        menu.push(this.buildStructure(reports, 'Reportes', 'assignment'));
        return menu;
    }

    /*Reemplazar caracteres */
    private static replaceALL(
        cadena: string,
        caracter: string,
        reemplazo: string
    ): any {
        return cadena.replace(new RegExp(caracter, 'g'), reemplazo);
    }

    /**
     * Summary. (Genera un groupby de acuerdo al tipo de tarea y asigna
     *           el resultado al grupo correspondiente)
     *
     * @access private
     * @param {Object}   groups         Objeto donde se almacenan los items del menu
     *                                  pertenecientes a cada grupo
     * @param {any}   firstLevel        Primer nivel del menu retornado por el servicio.
     * @param {any}   secondLevel       Segundo nivel del menu retornado por el servicio.
     *
     * @return {Object} Return value description.
     */
    private static setMenu(groups: any, firstLevel: any, secondLevel: any) {
        let label: string;
        let groupedTask: Object = _.groupBy(
            secondLevel['children'],
            'tipo_tarea'
        );

        if (groupedTask.hasOwnProperty(4)) {
            label = 'Cargues Masivos';
            groups = this.discriminateByType(
                label,
                {...firstLevel},
                {...secondLevel},
                {...groups},
                [...groupedTask[4]]
            );
            delete groupedTask[4];
        }

        if (groupedTask.hasOwnProperty(5)) {
            label = 'Reportes';
            groups = this.discriminateByType(
                label,
                {...firstLevel},
                {...secondLevel},
                {...groups},
                [...groupedTask[5]]
            );
            delete groupedTask[5];
        }

        label = 'Aplicaciones';
        groups = this.discriminateByType(
            label,
            {...firstLevel},
            {...secondLevel},
            {...groups},
            _.flatten(_.values(groupedTask))
        );
        return groups;
    }

    /**
     * Summary. (Se encarga de asignar el valor correspondiente a un grupo luego
     *           del agrupado previo)
     *
     * @access private
     * @param {string}   label          Nombre del grupo al que se asignaran la agrupación.
     * @param {any}   firstLevel        Primer nivel del menu retornado por el servicio.
     * @param {any}   secondLevel       Segundo nivel del menu retornado por el servicio.
     * @param {Object}   groups         Objeto donde se almacenan los items del menu
     *                                  pertenecientes a cada grupo
     * @param {any}   groupedTask       Items del menu agrupados por el tipo de grupo.
     *
     * @return {Object} Return value description.
     */
    private static discriminateByType(
        label: string,
        firstLevel: any,
        secondLevel: any,
        groups: any,
        groupedTask: any[]
    ) {
        if (groupedTask.length > 0) {
            secondLevel['children'] = groupedTask;
            firstLevel['children'] = [secondLevel];
            groups[label] = this.concatChildren(
                {...groups[label]},
                {...firstLevel}
            );
        }
        return groups;
    }

    /**
     * Summary. (Concatena los valores con el mismo nombre de menu, en caso de no existir,
     *          crea un "key" con el nombre del menuc)
     *
     * @access private
     * @param {any}   firstLevel        Primer nivel del menu retornado por el servicio.
     * @param {Object}   group         Objeto donde se almacenan los items del menu
     *                                  pertenecientes a cada grupo
     *
     * @return {Object} Return value description.
     */
    private static concatChildren(group: Object, firstLevel: any) {
        if (group.hasOwnProperty(firstLevel['id'])) {
            let groupType: any = {...group[firstLevel['id']]};

            groupType['children'] = [
                ...groupType['children'],
                ...firstLevel['children'],
            ];
            group[firstLevel['id']] = groupType;
        } else {
            group[firstLevel['id']] = firstLevel;
        }

        return group;
    }

    private static buildStructure(
        children: any[],
        title: string,
        icon: string
    ) {
        return {type: 'group', title: title, icon: icon, children: children};
    }
}
