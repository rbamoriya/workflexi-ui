import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndEditBasicinfoComponent } from './ind-edit-basicinfo.component';

describe('IndEditBasicinfoComponent', () => {
  let component: IndEditBasicinfoComponent;
  let fixture: ComponentFixture<IndEditBasicinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndEditBasicinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndEditBasicinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
