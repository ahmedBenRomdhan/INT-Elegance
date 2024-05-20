import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserProjectComponent } from './add-user-project.component';

describe('AddUserProjectComponent', () => {
  let component: AddUserProjectComponent;
  let fixture: ComponentFixture<AddUserProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
