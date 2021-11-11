import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneRejectReasonComponent } from './milestone-reject-reason.component';

describe('MilestoneRejectReasonComponent', () => {
  let component: MilestoneRejectReasonComponent;
  let fixture: ComponentFixture<MilestoneRejectReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MilestoneRejectReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MilestoneRejectReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
