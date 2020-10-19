import {Component, LOCALE_ID, OnInit, ViewEncapsulation} from '@angular/core';
import localEsAr from '@angular/common/locales/es-AR';
import {SettingsService} from '../../../../core/services/settings.service';
import {FuseSidebarService} from '../../../../../@fuse/components/sidebar/sidebar.service';
import {Router} from '@angular/router';
import {SglService} from '../../../../core/services/sgl.service';
import {ConfEjecucionModel, Message, MessageGroup} from '../../../../shared/models/Message.model';
import {registerLocaleData} from '@angular/common';
import {AuthenticationService} from '../../../../core/services/authentication.service';
import * as _ from 'lodash';

registerLocaleData(localEsAr, 'es-Ar');
const TIME = 60000;

@Component({
    selector: 'quick-panel',
    templateUrl: './quick-panel.component.html',
    styleUrls: ['./quick-panel.component.scss'],
    providers: [{provide: LOCALE_ID, useValue: 'es-Ar'}],
    encapsulation: ViewEncapsulation.None
})

export class QuickPanelComponent implements OnInit {

    public usr = '';
    public messages: Message[] = new Array<Message>();
    public messageGroup: MessageGroup[] = new Array<MessageGroup>();
    date: Date;
    events: any[];
    notes: any[];
    settings: any;
    public timer;

    /**
     * Constructor
     */
    constructor(
        private sglService: SglService,
        private authService: AuthenticationService,
        private router: Router,
        private _fuseSidebarService: FuseSidebarService,
        private _settings: SettingsService
    ) {
        // Set the defaults
        this.date = new Date();
        this.settings = {
            notify: true,
            cloud: false,
            retro: true
        };
    }

    ngOnInit(): void {
        const usr = sessionStorage.getItem('User');
        if (usr) {
            this.authService.usr.next(usr);
        }

        this.authService.usr.subscribe(
            user => {
                if ((user && user != '' && user != ' ')) {
                    this.usr = user;
                    this.getMessages();
                } else {
                    this.usr = '';
                }
            }
        );

        this.sglService.bhv_resetTimer.subscribe(
            timer => {
                if (timer) {
                    this.sglService.bhv_resetTimer.next(false);
                    clearTimeout(this.timer);
                    this.getMessages();
                }
            }
        );
    }

    getMessages() {
        this.usr = sessionStorage.getItem('User');
        if (this.usr && this.usr != '') {
            const parametros = new ConfEjecucionModel();
            parametros.Transaccion = 'CM';
            parametros.Usuario = this.usr;
            this.sglService.sglTareaEjecucion(parametros).subscribe(
                response => {
                    if (response['Estado'] && response['Value'][0]['ID_EJECUCION']) {
                        const tempMessages = response['Value'].filter(x => x.ID_TIPO_TAREA === 4 || x.ID_TIPO_TAREA === 5);
                        // Si hay mensajes nuevos se notifica:
                        if (tempMessages.length > this.messages.length) {
                            if (this.messages.length !== 0) {
                                let esta = this.messages.map(element => {
                                    delete element.ORDEN;
                                    return element;
                                });
                                let tempo = tempMessages.map(element => {
                                    delete element.ORDEN;
                                    return element;
                                });
                                const arrayDiffer = _.differenceWith(tempo, esta, _.isEqual);
                                const temp = (Object.keys(_.countBy(arrayDiffer, x => x.ID_EJECUCION)).length);
                                const viewed = this.sglService.bhv_newMessages.getValue();
                                /*this.sglService.bhv_viewedMessages.next(viewed + temp);*/
                                this.sglService.bhv_newMessages.next(viewed + temp);
                            } else {
                                const temp = (Object.keys(_.countBy(tempMessages, x => x.ID_EJECUCION)).length);
                                const viewed = this.sglService.bhv_viewedMessages.getValue();
                                this.sglService.bhv_newMessages.next(viewed + temp);
                            }
                        }
                        if (tempMessages.length != this.messages.length) {
                            this.messages = tempMessages;
                            const unique = [...new Set(response['Value']
                                .filter(x => x.ID_TIPO_TAREA == 4 || x.ID_TIPO_TAREA == 5)
                                .map(obj => obj.ID_EJECUCION))];

                            this.messageGroup = unique.map(
                                idEjecucionTarea => {
                                    return {
                                        ID_EJECUCION_TAREA: Number(idEjecucionTarea),
                                        ID_TIPO_TAREA: this.messages.find(x => x.ID_EJECUCION == idEjecucionTarea).ID_TIPO_TAREA,
                                        TAREA: this.messages.find(x => x.ID_EJECUCION == idEjecucionTarea).TAREA,
                                        MENSAJES: this.messages.filter(x => x.ID_EJECUCION == idEjecucionTarea)
                                            .sort((a, b) => a.ORDEN - b.ORDEN)
                                    };
                                }
                            ).sort((a, b) => b.ID_EJECUCION_TAREA - a.ID_EJECUCION_TAREA);
                        }
                    }
                },
                error => {
                    console.log('Error al consultar los mensajes');
                }
            );
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.getMessages();
            }, TIME);
        }
    }

    viewReport(message: Message) {
        if (message.ID_MENSAJE == 43 && message.ID_TIPO_TAREA == 5) {
            const params = `${message.TAREA}#${message.ID_EJECUCION}#${message.TOTAL_REGISTROS}#${message.LIMITE}`;
            const paramsEncode = btoa(params);
            this._fuseSidebarService.getSidebar('quickPanel').toggleOpen();
            this.router.navigate(['/reportesvw', paramsEncode]);
        } else if (message.ID_TIPO_TAREA == 4) {
            const params = `${message.TAREA}#${message.ID_RESULTADO}#${message.TOTAL_REGISTROS}#${message.LIMITE}#${message.ID_INTERNO}`;
            const paramsEncode = btoa(params);
            this.router.navigate(['/cmvw', paramsEncode]);
        }
    }

    GetColor(color) {
        const colorVal = color.replace('rgb(', '').replace('RGB(', '').replace(')', '').replace(' ', '').split(',');
        return '#' + this.ToHex(parseInt(colorVal[0])) + this.ToHex(parseInt(colorVal[1])) + this.ToHex((parseInt(colorVal[2])));
    }

    ToHex(c) {
        const hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }

    GetColorTipo(message: MessageGroup) {
        const totalMessages = message.MENSAJES.length - 1;
        if (message.MENSAJES[totalMessages]) {
            return this.GetColor(message.MENSAJES[totalMessages].COLOR);
        }
        return '#000000';
    }
}

