import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChildTaskComponent } from './add-child-task.component';

describe('AddChildTaskComponent', () => {
  let component: AddChildTaskComponent;
  let fixture: ComponentFixture<AddChildTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddChildTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChildTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
