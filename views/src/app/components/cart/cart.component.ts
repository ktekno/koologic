import { Component, ElementRef, OnInit } from '@angular/core';
import { AppService } from '../../app.service'; 

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit  {


  constructor(private _elementRef : ElementRef, public _appService: AppService) { 
    
  }

  ngOnInit(): void {
  }

  deleteFromCart(index: number): void{
    this._appService.removeFromCart(index);
  }

  goToDetails(index: number): void{
    window.location.href = this._appService.cart_contents[index].url;
  }
}
