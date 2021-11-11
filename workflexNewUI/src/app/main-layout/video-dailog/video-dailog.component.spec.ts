import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoDailogComponent } from './video-dailog.component';

describe('VideoDailogComponent', () => {
  let component: VideoDailogComponent;
  let fixture: ComponentFixture<VideoDailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoDailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
