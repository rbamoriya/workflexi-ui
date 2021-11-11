import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualheaderComponent } from './individualheader.component';

describe('IndividualheaderComponent', () => {
  let component: IndividualheaderComponent;
  let fixture: ComponentFixture<IndividualheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
