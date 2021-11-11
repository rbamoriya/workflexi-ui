import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndSidenavComponent } from './ind-sidenav.component';

describe('IndSidenavComponent', () => {
  let component: IndSidenavComponent;
  let fixture: ComponentFixture<IndSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
