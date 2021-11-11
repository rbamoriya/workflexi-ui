import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySidenavComponent } from './company-sidenav.component';

describe('CompanySidenavComponent', () => {
  let component: CompanySidenavComponent;
  let fixture: ComponentFixture<CompanySidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanySidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
