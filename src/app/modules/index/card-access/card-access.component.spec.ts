import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardAccessComponent} from './card-access.component';

describe('CardAccessComponent', () => {
  let component: CardAccessComponent;
  let fixture: ComponentFixture<CardAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
