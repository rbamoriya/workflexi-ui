import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GigCandidateProfileComponent } from './gig-candidate-profile.component';

describe('GigCandidateProfileComponent', () => {
  let component: GigCandidateProfileComponent;
  let fixture: ComponentFixture<GigCandidateProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GigCandidateProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GigCandidateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
