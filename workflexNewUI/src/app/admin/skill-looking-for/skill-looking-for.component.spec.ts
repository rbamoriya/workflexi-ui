import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillLookingForComponent } from './skill-looking-for.component';

describe('SkillLookingForComponent', () => {
  let component: SkillLookingForComponent;
  let fixture: ComponentFixture<SkillLookingForComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillLookingForComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillLookingForComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
