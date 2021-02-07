import { Injectable } from '@angular/core';  
import { CookieService } from 'ngx-cookie';
import { error } from 'protractor';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
 
 @Injectable()
 export class AppService {  
    
    cartNavBarWidth: string = "0px";
    cart_contents: any[];
    showCart: boolean = false;
    path: string = "";
    
    constructor(public authService: AuthService, 
      public cartService: CartService, 
      private cookieService: CookieService){
        this.cart_contents = typeof this.cookieService.getObject('cart_contents') !== "undefined"? 
                              <any[]>(this.cookieService.getObject('cart_contents')) :
                              [];
    }

    addToCart(cart_content: any): void{
      let _this = this;
      let cart_content_index = this.cart_contents.findIndex(x => x.prod_id == cart_content.prod_id);
      if(cart_content_index > -1){
        this.cart_contents[cart_content_index].quantity += cart_content.quantity;
        this.cart_contents[cart_content_index].priceBadge = parseFloat(this.cart_contents[cart_content_index].quantity) * parseFloat(cart_content.priceBadge);
      } else {
        this.cart_contents.push(cart_content);
      }
      this.authService.isAuthenticated().then((response: any) => {
        if(response.success){
          _this.cartService.updateCart(cart_content_index > -1? _this.cart_contents[cart_content_index] : cart_content).subscribe((result: any)=>{
            console.log(result);
          });
        }
        this.cookieService.putObject('cart_contents', this.cart_contents);
      }, (error)=>{
        this.cookieService.putObject('cart_contents', this.cart_contents);
      }).catch(error =>{
        this.cookieService.putObject('cart_contents', this.cart_contents);
      })
    }
    
    removeFromCart(cart_content_index: any): void{
      let _this = this;
      if(cart_content_index > -1){
        this.authService.isAuthenticated().then((response: any) => {
          if(response.success){
            _this.cartService.removeFromCart(_this.cart_contents[cart_content_index].prod_id).subscribe((result: any)=>{
            });
          }
          this.cart_contents.splice(cart_content_index, 1);
          this.cookieService.putObject('cart_contents', this.cart_contents);
        }).catch((error) => {
          console.log(error)
          this.cart_contents.splice(cart_content_index, 1);
          this.cookieService.putObject('cart_contents', this.cart_contents);
        })
      } 
    }

    updateCartChanges(cart_content: any): void{
      let _this = this;
      this.authService.isAuthenticated().then((response: any) => {
        if(response.success){
          _this.cartService.updateCart(cart_content).subscribe((result: any)=>{
          });
        }
      }, (error)=>{
        console.log(error)
      })
      this.cookieService.putObject('cart_contents', this.cart_contents);
    }

    refreshCart(): void {
      this.cart_contents = typeof this.cookieService.getObject('cart_contents') !== "undefined"? 
      <any[]>(this.cookieService.getObject('cart_contents')) :
      [];
    }

    openCart(): void{
      if (window.matchMedia("(max-width: 540px)").matches)
        this.cartNavBarWidth="100%";
      else
        this.cartNavBarWidth="400px";
    }

    closeNav(): void{
      this.cartNavBarWidth="0px";
    }
 } 