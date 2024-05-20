import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailTaskComponent } from './trail-task.component';

describe('TrailTaskComponent', () => {
  let component: TrailTaskComponent;
  let fixture: ComponentFixture<TrailTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
