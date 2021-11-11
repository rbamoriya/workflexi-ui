import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringIndComponent } from './hiring-ind.component';

describe('HiringIndComponent', () => {
  let component: HiringIndComponent;
  let fixture: ComponentFixture<HiringIndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiringIndComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiringIndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
