import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEndDateComponent } from './task-end-date.component';

describe('TaskEndDateComponent', () => {
  let component: TaskEndDateComponent;
  let fixture: ComponentFixture<TaskEndDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskEndDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskEndDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
