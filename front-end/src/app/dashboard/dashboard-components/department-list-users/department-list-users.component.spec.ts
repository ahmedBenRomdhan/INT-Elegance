import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentListUsersComponent } from './department-list-users.component';

describe('DepartmentListUsersComponent', () => {
  let component: DepartmentListUsersComponent;
  let fixture: ComponentFixture<DepartmentListUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentListUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentListUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
