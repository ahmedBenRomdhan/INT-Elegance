import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailProjectComponent } from './trail-project.component';

describe('TrailProjectComponent', () => {
  let component: TrailProjectComponent;
  let fixture: ComponentFixture<TrailProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
