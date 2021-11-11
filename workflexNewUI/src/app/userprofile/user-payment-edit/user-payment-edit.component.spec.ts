import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPaymentEditComponent } from './user-payment-edit.component';

describe('UserPaymentEditComponent', () => {
  let component: UserPaymentEditComponent;
  let fixture: ComponentFixture<UserPaymentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPaymentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPaymentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
