import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandaloneRegistrationComponent } from './standalone-registration.component';

describe('StandaloneRegistrationComponent', () => {
  let component: StandaloneRegistrationComponent;
  let fixture: ComponentFixture<StandaloneRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandaloneRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandaloneRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
