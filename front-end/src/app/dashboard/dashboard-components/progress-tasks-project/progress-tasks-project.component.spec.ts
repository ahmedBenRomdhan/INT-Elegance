import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressTasksProjectComponent } from './progress-tasks-project.component';

describe('ProgressTasksProjectComponent', () => {
  let component: ProgressTasksProjectComponent;
  let fixture: ComponentFixture<ProgressTasksProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressTasksProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressTasksProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
