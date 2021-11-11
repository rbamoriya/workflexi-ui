import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprrovedMilestonesComponent } from './aprroved-milestones.component';

describe('AprrovedMilestonesComponent', () => {
  let component: AprrovedMilestonesComponent;
  let fixture: ComponentFixture<AprrovedMilestonesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprrovedMilestonesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprrovedMilestonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
