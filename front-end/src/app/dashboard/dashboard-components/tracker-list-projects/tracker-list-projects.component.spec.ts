import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerListProjectsComponent } from './tracker-list-projects.component';

describe('TrackerListProjectsComponent', () => {
  let component: TrackerListProjectsComponent;
  let fixture: ComponentFixture<TrackerListProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackerListProjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackerListProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
