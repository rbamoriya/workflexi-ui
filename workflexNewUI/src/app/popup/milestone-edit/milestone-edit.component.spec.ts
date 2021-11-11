import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneEditComponent } from './milestone-edit.component';

describe('MilestoneEditComponent', () => {
  let component: MilestoneEditComponent;
  let fixture: ComponentFixture<MilestoneEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MilestoneEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MilestoneEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
