import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyApprovedComponent } from './company-approved.component';

describe('CompanyApprovedComponent', () => {
  let component: CompanyApprovedComponent;
  let fixture: ComponentFixture<CompanyApprovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyApprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
