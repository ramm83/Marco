import {Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2} from '@angular/core';

@Directive({
    selector: '[appIframeTracker]'
})
export class IframeTrackerDirective implements OnInit {
    @Input() debug: boolean;
    @Output() iframeClick = new EventEmitter<ElementRef>();
    private iframeMouseOver: boolean;

    constructor(private el: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit(): void {
    }

    @HostListener('mouseover')
    private onIframeMouseOver() {
        this.iframeClick.emit(this.el);
    }

    @HostListener('mouseout')
    private onIframeMouseOut() {
        this.iframeMouseOver = false;
        this.iframeClick.emit(this.el);
    }

}
