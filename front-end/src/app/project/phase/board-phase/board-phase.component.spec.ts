import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardPhaseComponent } from './board-phase.component';

describe('BoardPhaseComponent', () => {
  let component: BoardPhaseComponent;
  let fixture: ComponentFixture<BoardPhaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardPhaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
