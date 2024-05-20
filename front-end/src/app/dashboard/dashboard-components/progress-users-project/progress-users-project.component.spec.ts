import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressUsersProjectComponent } from './progress-users-project.component';

describe('ProgressUsersProjectComponent', () => {
  let component: ProgressUsersProjectComponent;
  let fixture: ComponentFixture<ProgressUsersProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressUsersProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressUsersProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
