import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringProfileComponent } from './hiring-profile.component';

describe('HiringProfileComponent', () => {
  let component: HiringProfileComponent;
  let fixture: ComponentFixture<HiringProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiringProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiringProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
