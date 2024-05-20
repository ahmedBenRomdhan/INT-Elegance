import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsUserStatisticsComponent } from './cards-user-statistics.component';

describe('CardsUserStatisticsComponent', () => {
  let component: CardsUserStatisticsComponent;
  let fixture: ComponentFixture<CardsUserStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardsUserStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsUserStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
