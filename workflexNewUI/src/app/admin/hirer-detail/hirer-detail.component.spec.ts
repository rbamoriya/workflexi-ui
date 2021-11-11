import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HirerDetailComponent } from './hirer-detail.component';

describe('HirerDetailComponent', () => {
  let component: HirerDetailComponent;
  let fixture: ComponentFixture<HirerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HirerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HirerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
