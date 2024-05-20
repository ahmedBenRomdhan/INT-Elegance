import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUserComponent } from './list-user.component';
import { By } from '@angular/platform-browser';

fdescribe('ListUserComponent', () => {
  let component: ListUserComponent;
  let fixture: ComponentFixture<ListUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the card title', () => {
    const cardTitle = fixture.debugElement.query(By.css('.title'));
    expect(cardTitle.nativeElement.textContent).toContain(component.cardName);
  });

  it('should render the search input', () => {
    const searchInput = fixture.debugElement.query(By.css('.input-size'));
    expect(searchInput).toBeTruthy();
  });


});
