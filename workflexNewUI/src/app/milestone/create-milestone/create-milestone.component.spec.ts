import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMilestoneComponent } from './create-milestone.component';

describe('CreateMilestoneComponent', () => {
  let component: CreateMilestoneComponent;
  let fixture: ComponentFixture<CreateMilestoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMilestoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMilestoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
