import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBasicInfoEditComponent } from './user-basic-info-edit.component';

describe('UserBasicInfoEditComponent', () => {
  let component: UserBasicInfoEditComponent;
  let fixture: ComponentFixture<UserBasicInfoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserBasicInfoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBasicInfoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
