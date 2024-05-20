import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsGeneralStatisticsComponent } from './cards-general-statistics.component';

describe('CardsGeneralStatisticsComponent', () => {
  let component: CardsGeneralStatisticsComponent;
  let fixture: ComponentFixture<CardsGeneralStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardsGeneralStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsGeneralStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
