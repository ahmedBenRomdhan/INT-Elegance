import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsProjectComponent } from './cards-project.component';

describe('CardsProjectComponent', () => {
  let component: CardsProjectComponent;
  let fixture: ComponentFixture<CardsProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardsProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
