import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowOrderPageComponent } from './show-order-page.component';

describe('ShowOrderPageComponent', () => {
  let component: ShowOrderPageComponent;
  let fixture: ComponentFixture<ShowOrderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowOrderPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowOrderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
