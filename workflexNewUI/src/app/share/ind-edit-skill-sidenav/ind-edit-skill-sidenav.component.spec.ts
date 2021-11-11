import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndEditSkillSidenavComponent } from './ind-edit-skill-sidenav.component';

describe('IndEditSkillSidenavComponent', () => {
  let component: IndEditSkillSidenavComponent;
  let fixture: ComponentFixture<IndEditSkillSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndEditSkillSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndEditSkillSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
