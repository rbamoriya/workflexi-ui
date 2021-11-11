import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSkillslookingComponent } from './edit-skillslooking.component';

describe('EditSkillslookingComponent', () => {
  let component: EditSkillslookingComponent;
  let fixture: ComponentFixture<EditSkillslookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSkillslookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSkillslookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
