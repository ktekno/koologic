import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartSummaryTableComponent } from './cart-summary-table.component';

describe('CartSummaryTableComponent', () => {
  let component: CartSummaryTableComponent;
  let fixture: ComponentFixture<CartSummaryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartSummaryTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartSummaryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
