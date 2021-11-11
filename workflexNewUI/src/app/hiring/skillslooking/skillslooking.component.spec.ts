import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillslookingComponent } from './skillslooking.component';

describe('SkillslookingComponent', () => {
  let component: SkillslookingComponent;
  let fixture: ComponentFixture<SkillslookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillslookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillslookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
