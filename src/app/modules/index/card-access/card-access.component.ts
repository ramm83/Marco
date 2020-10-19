import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {Router} from '@angular/router';
import {AuthenticationService} from '@core/services/authentication.service';

@Component({
    selector: 'app-card-access',
    templateUrl: './card-access.component.html',
    styleUrls: ['./card-access.component.scss'],
    animations: fuseAnimations
})
export class CardAccessComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() title: any;
    @Input() icon: any;
    @Input() items: any;
    @Input() img: any;
    @Input() timeAnimate = 0;
    animate = 0;
    @ViewChild('papacard', {static: true}) elementView: ElementRef;

    itemsShow = [];

    constructor(
        private router: Router,
        private _authenticationService: AuthenticationService
    ) {
    }

    ngOnInit(): void {
        if (this.items.currentValue !== []) {
            this.lauchDelayAnimation();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.items.currentValue !== []) {
            this.reCount();
            this.lauchDelayAnimation();
        }
    }

    navigate(option: any) {
        this._authenticationService.percistAccess(option.item.id_tarea);
        this.router.navigate([option.item.url]);
    }

    @HostListener('window:resize', ['$event'])
    onResize(_event) {
        this.reCount();
    }

    private reCount() {
        const heightPapa = this.elementView.nativeElement.offsetHeight;
        this.itemsShow = this.items.slice(0, Math.floor((heightPapa - 10) / 80));
    }

    ngAfterViewInit(): void {
        this.reCount();
    }

    private lauchDelayAnimation() {
        setTimeout(() => {
            this.animate = 1;
        }, this.timeAnimate);
    }

}
