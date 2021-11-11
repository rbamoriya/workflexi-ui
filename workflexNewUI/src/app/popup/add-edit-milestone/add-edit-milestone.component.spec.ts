import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMilestoneComponent } from './add-edit-milestone.component';

describe('AddEditMilestoneComponent', () => {
  let component: AddEditMilestoneComponent;
  let fixture: ComponentFixture<AddEditMilestoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditMilestoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditMilestoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
