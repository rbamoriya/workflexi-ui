import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GigWorkerDetailComponent } from './gig-worker-detail.component';

describe('GigWorkerDetailComponent', () => {
  let component: GigWorkerDetailComponent;
  let fixture: ComponentFixture<GigWorkerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GigWorkerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GigWorkerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
