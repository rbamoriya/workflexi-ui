import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndEditPaymentComponent } from './ind-edit-payment.component';

describe('IndEditPaymentComponent', () => {
  let component: IndEditPaymentComponent;
  let fixture: ComponentFixture<IndEditPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndEditPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndEditPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
