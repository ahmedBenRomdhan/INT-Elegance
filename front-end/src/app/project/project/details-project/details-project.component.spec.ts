import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsProjectComponent } from './details-project.component';

describe('DetailsProjectComponent', () => {
  let component: DetailsProjectComponent;
  let fixture: ComponentFixture<DetailsProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
