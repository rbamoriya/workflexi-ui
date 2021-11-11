import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneApprovalViewComponent } from './milestone-approval-view.component';

describe('MilestoneApprovalViewComponent', () => {
  let component: MilestoneApprovalViewComponent;
  let fixture: ComponentFixture<MilestoneApprovalViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MilestoneApprovalViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MilestoneApprovalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
