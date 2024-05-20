import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePhaseComponent } from './delete-phase.component';

describe('DeletePhaseComponent', () => {
  let component: DeletePhaseComponent;
  let fixture: ComponentFixture<DeletePhaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePhaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
