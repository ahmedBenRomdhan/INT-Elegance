import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMeetingComponent } from './add-meeting.component';

fdescribe('AddMeetingComponent', () => {
  let component: AddMeetingComponent;
  let fixture: ComponentFixture<AddMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMeetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(AddMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
