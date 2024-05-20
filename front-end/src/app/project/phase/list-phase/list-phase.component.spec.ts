import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPhaseComponent } from './list-phase.component';

describe('ListPhaseComponent', () => {
  let component: ListPhaseComponent;
  let fixture: ComponentFixture<ListPhaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPhaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
