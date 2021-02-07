import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReceivedPageComponent } from './order-received-page.component';

describe('OrderReceivedPageComponent', () => {
  let component: OrderReceivedPageComponent;
  let fixture: ComponentFixture<OrderReceivedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderReceivedPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderReceivedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
