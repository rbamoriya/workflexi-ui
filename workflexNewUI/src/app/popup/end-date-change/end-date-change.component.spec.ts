import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndDateChangeComponent } from './end-date-change.component';

describe('EndDateChangeComponent', () => {
  let component: EndDateChangeComponent;
  let fixture: ComponentFixture<EndDateChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndDateChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndDateChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
