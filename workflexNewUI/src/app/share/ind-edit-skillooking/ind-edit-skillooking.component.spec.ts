import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndEditSkillookingComponent } from './ind-edit-skillooking.component';

describe('IndEditSkillookingComponent', () => {
  let component: IndEditSkillookingComponent;
  let fixture: ComponentFixture<IndEditSkillookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndEditSkillookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndEditSkillookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
