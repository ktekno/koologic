import { Component, Input, OnInit } from '@angular/core';
import { AppService } from '../../app.service'; 

@Component({
  selector: 'app-cart-summary-table',
  templateUrl: './cart-summary-table.component.html',
  styleUrls: ['./cart-summary-table.component.css']
})
export class CartSummaryTableComponent implements OnInit {

  @Input() showShippingFee : boolean = false;
  @Input() shippingFeeVal: number = 0;
  @Input() tableContent: any = [];
  @Input() voucherVal: number = 0;

  constructor(public _appService: AppService) { }

  ngOnInit(): void {
    
  }

  getQuantityTotal(): number {
    return this.tableContent.reduce(function(prev: any, cur: any) {return parseFloat(prev) + parseFloat(cur.quantity);}, 0);
    //return this._appService.cart_contents.reduce(function(prev: any, cur: any) {return parseFloat(prev) + parseFloat(cur.quantity);}, 0);
  }

  getPriceTotal(): number {
    return this.tableContent.reduce(function(prev: any, cur: any) {return parseFloat(prev) + parseFloat(cur.priceBadge);}, 0);
    //return this._appService.cart_contents.reduce(function(prev: any, cur: any) {return parseFloat(prev) + parseFloat(cur.priceBadge);}, 0);
  }

}
