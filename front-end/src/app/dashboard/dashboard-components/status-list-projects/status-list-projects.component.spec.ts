import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusListProjectsComponent } from './status-list-projects.component';

describe('StatusListProjectsComponent', () => {
  let component: StatusListProjectsComponent;
  let fixture: ComponentFixture<StatusListProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusListProjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusListProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
