import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowtojoinusComponent } from './howtojoinus.component';

describe('HowtojoinusComponent', () => {
  let component: HowtojoinusComponent;
  let fixture: ComponentFixture<HowtojoinusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowtojoinusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowtojoinusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
