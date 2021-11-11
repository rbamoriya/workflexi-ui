import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GigWorkerComponent } from './gig-worker.component';

describe('GigWorkerComponent', () => {
  let component: GigWorkerComponent;
  let fixture: ComponentFixture<GigWorkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GigWorkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GigWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
