import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailUserComponent } from './trail-user.component';

describe('TrailUserComponent', () => {
  let component: TrailUserComponent;
  let fixture: ComponentFixture<TrailUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
