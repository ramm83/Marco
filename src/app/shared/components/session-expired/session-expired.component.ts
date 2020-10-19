import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AuthenticationService} from '@core/services/authentication.service';
import {CountdownEvent} from 'ngx-countdown';

@Component({
    selector: 'app-session-expired',
    templateUrl: './session-expired.component.html',
    styleUrls: ['./session-expired.component.scss'],
})
export class SessionExpiredComponent {
    constructor(
        public dialogRef: MatDialog,
        private dialogRefSelft: MatDialogRef<SessionExpiredComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public router: Router,
        private _authService: AuthenticationService,
    ) {
    }

    onClose(): void {
        this.dialogRef.closeAll();
        setTimeout(
            () => {
                this.router.navigate([this.data.route]);
            }, 300
        );
    }

    continuar() {
        this._authService.captureClick = true;
        this._authService.nextIsInactive(true);
        this.dialogRefSelft.close();
    }

    handleEvent($event: CountdownEvent) {
        if ($event.action === 'done') {
            this.dialogRefSelft.close();
        }
    }
}
